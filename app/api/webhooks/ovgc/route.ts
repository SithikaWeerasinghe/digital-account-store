import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { verifyOvgcWebhookSecret, mapOvgcStatus } from '@/lib/services/ovgcPaymentService';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';
import { deliverOrder } from '@/lib/services/deliveryService';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/ovgc
 *
 * Receives OVGC payment notifications. Authenticity is verified by comparing the
 * `webhook_secret` in the payload against OVGC_WEBHOOK_SECRET. Only a verified
 * "Paid" status marks an order paid and triggers delivery. Idempotent: an order
 * already delivered is never re-delivered (deliverOrder guards), and confirmation
 * emails only fire on the pending→paid transition.
 *
 * NOTE: OVGC's exact payload shape isn't fully documented yet, so we read the
 * order reference / payment id / status from several likely field names. See
 * docs/ovgc-integration-requirements.md (TODO: lock these to the real fields).
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    // 1. Verify the shared secret carried in the payload.
    if (!verifyOvgcWebhookSecret(payload?.webhook_secret)) {
      console.warn('[ovgc webhook] Invalid or missing webhook_secret — rejecting');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    // 2. Resolve identifiers + status from likely field names.
    const reference: string =
      payload?.order_uuid || payload?.checkout_reference || payload?.order_id || payload?.reference || '';
    const providerPaymentId = String(
      payload?.transaction_id || payload?.payment_id || payload?.id || ''
    );
    const rawStatus: string = payload?.payment_status || payload?.status || '';
    const mapped = mapOvgcStatus(rawStatus);

    // 3. Find the related order(s): by our checkout reference, then by payment id.
    let orders: Order[] = reference ? await orderService.getOrdersByCheckoutReference(reference) : [];
    if (orders.length === 0 && providerPaymentId) {
      orders = await orderService.getOrdersByProviderPaymentId(providerPaymentId);
    }
    if (orders.length === 0) {
      console.warn('[ovgc webhook] No matching order', { reference, providerPaymentId });
      return NextResponse.json({ success: true, ignored: true, reason: 'no matching order' });
    }

    if (mapped === 'paid') {
      // Idempotency: only newly-paid orders get the status update + emails.
      const newlyPaid = orders.filter((o) => o.payment_status !== 'paid');

      await Promise.allSettled(
        newlyPaid.map((o) =>
          orderService.updateOrderPaymentFields(o.id, {
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            payment_provider: 'ovgc',
            provider_payment_id: providerPaymentId || o.provider_payment_id || null,
          })
        )
      );

      await Promise.allSettled(
        newlyPaid.flatMap((o) => [sendOrderConfirmation({ ...o, payment_status: 'paid' }), sendAdminNotification(o)])
      );

      // Automatic delivery (variant-aware; skips already-delivered → no dupes).
      await Promise.allSettled(orders.map((o) => deliverOrder(o.id, false)));
    } else if (mapped === 'failed') {
      // Declined / expired → mark failed, never deliver. Don't downgrade a paid order.
      await Promise.allSettled(
        orders
          .filter((o) => o.payment_status !== 'paid')
          .map((o) =>
            orderService.updateOrderPaymentFields(o.id, {
              payment_status: 'failed',
              payment_provider: 'ovgc',
              provider_payment_id: providerPaymentId || o.provider_payment_id || null,
            })
          )
      );
    }
    // 'pending' → leave the order pending, deliver nothing.

    return NextResponse.json({
      success: true,
      ovgc_status: rawStatus,
      mapped_status: mapped,
      orders_matched: orders.length,
    });
  } catch (error: any) {
    // 500 so OVGC retries transient failures.
    console.error('[ovgc webhook] Error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// OVGC may probe the endpoint — respond OK to GET.
export async function GET() {
  return NextResponse.json({ success: true, service: 'ovgc-webhook' });
}
