import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import {
  getPayment,
  mapPaymentStatus,
  verifyWebhookSignature,
} from '@/lib/mercadopago';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The shape accepted by the order payment-fields updater.
type PaymentFieldsUpdate = Parameters<typeof orderService.updateOrderPaymentFields>[1];

/**
 * POST /api/webhooks/mercadopago
 *
 * Receives Mercado Pago payment notifications. Mercado Pago sends the payment id
 * only (via query params and/or JSON body); we fetch the full payment server-side,
 * locate the related Supabase order, and update its status.
 *
 * IMPORTANT: This is the ONLY place an order is marked paid. The browser redirect
 * to /checkout/success never marks an order paid.
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({} as any));

    // Topic/type can arrive in the query string or the JSON body.
    const topic =
      url.searchParams.get('type') ||
      url.searchParams.get('topic') ||
      body?.type ||
      body?.topic ||
      '';

    // Payment id can arrive as ?data.id=, ?id=, or body.data.id
    const dataId =
      url.searchParams.get('data.id') ||
      url.searchParams.get('id') ||
      body?.data?.id ||
      body?.id ||
      null;

    // Only payment notifications are actionable here. Acknowledge everything else
    // with 200 so Mercado Pago stops retrying (e.g. merchant_order, plan, etc.).
    if (topic && topic !== 'payment') {
      return NextResponse.json({ success: true, ignored: true, topic });
    }

    if (!dataId) {
      return NextResponse.json({ success: true, ignored: true, reason: 'no payment id' });
    }

    // Verify the signature when a webhook secret is configured.
    const signatureValid = verifyWebhookSignature({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId: String(dataId),
    });
    if (!signatureValid) {
      console.warn('[mercadopago webhook] Invalid signature — rejecting notification');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    // Fetch the authoritative payment record from Mercado Pago.
    const payment = await getPayment(String(dataId));

    // Resolve the related Supabase order(s) from metadata or external_reference.
    const metaOrderIds: string[] = Array.isArray(payment.metadata?.order_ids)
      ? payment.metadata!.order_ids.map(String)
      : [];
    const singleOrderId =
      payment.metadata?.order_id?.toString() || payment.external_reference?.toString() || null;

    const orderIds = metaOrderIds.length > 0
      ? metaOrderIds
      : singleOrderId
        ? [singleOrderId]
        : [];

    if (orderIds.length === 0) {
      console.warn(`[mercadopago webhook] Payment ${dataId} has no resolvable order reference`);
      return NextResponse.json({ success: true, ignored: true, reason: 'no order reference' });
    }

    const mappedStatus = mapPaymentStatus(payment.status);
    const merchantOrderId = payment.order?.id ? String(payment.order.id) : null;

    // Build the field patch shared across all orders in this checkout.
    const patch: PaymentFieldsUpdate = {
      mercadopago_payment_id: String(payment.id),
      mercadopago_status: payment.status,
      mercadopago_merchant_order_id: merchantOrderId,
    };

    if (mappedStatus === 'paid') {
      patch.payment_status = 'paid';
      patch.delivery_status = 'pending';
      patch.paid_at = new Date().toISOString();
    } else if (mappedStatus === 'failed') {
      patch.payment_status = 'failed';
    } else if (mappedStatus === 'refunded') {
      patch.payment_status = 'refunded';
    }
    // pending / in_process: only the mercadopago_status fields are written.

    const results = await Promise.allSettled(
      orderIds.map((id) => orderService.updateOrderPaymentFields(id, patch))
    );

    const updatedOrders = results
      .filter((r): r is PromiseFulfilledResult<Order | null> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((o): o is Order => !!o);
    const updated = updatedOrders.length;

    // On approved payment, dispatch the customer payment confirmation + admin
    // paid-order notification. Best-effort only: emailService no-ops when
    // RESEND_API_KEY is missing, and a failure here must never break the webhook
    // (Promise.allSettled + emailService internal try/catch guarantee this).
    if (mappedStatus === 'paid' && updatedOrders.length > 0) {
      await Promise.allSettled(
        updatedOrders.flatMap((order) => [
          sendOrderConfirmation(order),
          sendAdminNotification(order),
        ])
      );
    }

    return NextResponse.json({
      success: true,
      payment_id: String(payment.id),
      mp_status: payment.status,
      order_status: mappedStatus ?? 'pending',
      orders_updated: updated,
    });
  } catch (error: any) {
    // Return 500 so Mercado Pago retries transient failures (e.g. DB hiccup).
    console.error('[mercadopago webhook] Error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Mercado Pago occasionally probes the endpoint with GET — respond OK.
export async function GET() {
  return NextResponse.json({ success: true, service: 'mercadopago-webhook' });
}
