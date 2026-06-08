import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import {
  verifyNowPaymentsSignature,
  mapNowPaymentsStatus,
} from '@/lib/services/nowpaymentsService';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';
import { deliverOrder } from '@/lib/services/deliveryService';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/nowpayments
 *
 * Receives NOWPayments IPN notifications. We verify the x-nowpayments-sig
 * signature against the raw body, resolve the related Supabase order(s) by the
 * shared checkout_reference (order_id) or provider payment/invoice id, and — only
 * for finished/confirmed payments — mark them paid and trigger delivery.
 *
 * IMPORTANT: This is the ONLY place a NOWPayments order is marked paid/delivered.
 * The browser redirect to /checkout/success never marks an order paid.
 */
export async function POST(request: NextRequest) {
  try {
    // Raw body is required for signature verification.
    const rawBody = await request.text();
    const signature = request.headers.get('x-nowpayments-sig');

    if (!verifyNowPaymentsSignature(rawBody, signature)) {
      console.warn('[nowpayments webhook] Invalid signature — rejecting');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const status: string = payload?.payment_status || '';
    const reference: string = payload?.order_id || '';
    const providerPaymentId = String(payload?.invoice_id || payload?.payment_id || '');

    // Resolve orders: prefer the shared checkout_reference (our order_id), then
    // fall back to the provider invoice/payment id we stored at checkout.
    let orders: Order[] = reference
      ? await orderService.getOrdersByCheckoutReference(reference)
      : [];
    if (orders.length === 0 && providerPaymentId) {
      orders = await orderService.getOrdersByProviderPaymentId(providerPaymentId);
    }

    if (orders.length === 0) {
      console.warn('[nowpayments webhook] No matching order', { reference, providerPaymentId });
      return NextResponse.json({ success: true, ignored: true, reason: 'no matching order' });
    }

    const mapped = mapNowPaymentsStatus(status);

    if (mapped === 'paid') {
      // Idempotency: only act on orders not already marked paid (prevents
      // duplicate confirmation emails / re-processing on repeated IPNs).
      const newlyPaid = orders.filter((o) => o.payment_status !== 'paid');

      await Promise.allSettled(
        newlyPaid.map((o) =>
          orderService.updateOrderPaymentFields(o.id, {
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            payment_provider: 'nowpayments',
            provider_payment_id: providerPaymentId || o.provider_payment_id || null,
          })
        )
      );

      // Confirmation + admin notification emails (best-effort; never blocks).
      await Promise.allSettled(
        newlyPaid.flatMap((o) => [sendOrderConfirmation({ ...o, payment_status: 'paid' }), sendAdminNotification(o)])
      );

      // Automatic delivery. deliverOrder is variant-aware and guards against
      // re-delivery (already-delivered orders are skipped), so duplicate IPNs
      // never send duplicate credentials.
      await Promise.allSettled(orders.map((o) => deliverOrder(o.id, false)));
    } else if (mapped === 'failed') {
      await Promise.allSettled(
        orders
          .filter((o) => o.payment_status !== 'paid') // never downgrade a paid order
          .map((o) =>
            orderService.updateOrderPaymentFields(o.id, {
              payment_status: 'failed',
              provider_payment_id: providerPaymentId || o.provider_payment_id || null,
            })
          )
      );
    } else if (mapped === 'refunded') {
      await Promise.allSettled(
        orders.map((o) =>
          orderService.updateOrderPaymentFields(o.id, { payment_status: 'refunded' })
        )
      );
    }
    // pending (waiting/confirming/sending/partially_paid): acknowledge, no change.

    return NextResponse.json({
      success: true,
      np_status: status,
      mapped_status: mapped,
      orders_matched: orders.length,
    });
  } catch (error: any) {
    // Return 500 so NOWPayments retries transient failures.
    console.error('[nowpayments webhook] Error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// NOWPayments may probe the endpoint — respond OK.
export async function GET() {
  return NextResponse.json({ success: true, service: 'nowpayments-webhook' });
}
