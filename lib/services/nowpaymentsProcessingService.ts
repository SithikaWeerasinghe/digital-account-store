import { Order } from '@/types/order';
import * as orderService from '@/lib/services/orderService';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';
import { deliverOrder } from '@/lib/services/deliveryService';

/**
 * Shared "NOWPayments confirmed payment" processor.
 *
 * Used by BOTH the real IPN webhook (/api/webhooks/nowpayments) and the
 * admin-only simulation endpoint so they run identical logic: mark paid, set
 * paid_at, send confirmation/admin emails once, then deliver via the existing
 * variant-aware deliverOrder().
 *
 * Idempotency:
 *  - An order already `paid` is not re-stamped or re-emailed.
 *  - An order already `delivered` is never re-delivered (deliverOrder guards),
 *    so credentials are never sent twice and stock is never double-assigned.
 */

export interface ProcessPaidResult {
  ok: boolean;
  alreadyDelivered: boolean;
  deliveryFailed: boolean;
  message: string;
  order?: Order | null;
}

/** True only when payment test tools are explicitly enabled. */
export function isPaymentTestToolsEnabled(): boolean {
  return process.env.ENABLE_PAYMENT_TEST_TOOLS === 'true';
}

/**
 * Processes a single confirmed NOWPayments order: paid → deliver.
 * Safe to call repeatedly (idempotent).
 */
export async function processPaidNowPaymentsOrder(
  orderId: string,
  providerPaymentId?: string
): Promise<ProcessPaidResult> {
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    return { ok: false, alreadyDelivered: false, deliveryFailed: false, message: 'Order not found' };
  }

  // Already delivered → never re-deliver / re-email.
  if (order.delivery_status === 'delivered') {
    return {
      ok: true,
      alreadyDelivered: true,
      deliveryFailed: false,
      message: 'Order is already delivered.',
      order,
    };
  }

  // Mark paid (+ paid_at + provider fields) only if not already paid, and send
  // the confirmation/admin emails once on that transition.
  if (order.payment_status !== 'paid') {
    await orderService.updateOrderPaymentFields(orderId, {
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      payment_provider: 'nowpayments',
      provider_payment_id: providerPaymentId || order.provider_payment_id || null,
    });
    await Promise.allSettled([
      sendOrderConfirmation({ ...order, payment_status: 'paid' }),
      sendAdminNotification(order),
    ]);
  }

  // Deliver via the existing variant-aware flow (assigns inventory, marks sold,
  // sends delivery email, sets delivery_status). deliverOrder re-reads fresh
  // state and enforces the real stock checks — no bypass.
  const result = await deliverOrder(orderId, false);
  const updated = await orderService.getOrderById(orderId);

  if (!result.success) {
    return {
      ok: false,
      alreadyDelivered: false,
      deliveryFailed: true,
      message: result.message || 'Payment marked paid, but delivery failed.',
      order: updated,
    };
  }

  return {
    ok: true,
    alreadyDelivered: false,
    deliveryFailed: false,
    message: result.message || 'Order delivered.',
    order: updated,
  };
}

/**
 * Batch helper for the webhook: processes every order in a confirmed checkout.
 * Delegates to processPaidNowPaymentsOrder so behaviour is identical, and uses
 * allSettled so one failed delivery never aborts the others.
 */
export async function processPaidNowPaymentsOrders(
  orders: Order[],
  providerPaymentId?: string
): Promise<void> {
  if (orders.length === 0) return;
  await Promise.allSettled(
    orders.map((o) => processPaidNowPaymentsOrder(o.id, providerPaymentId))
  );
}
