import { Order } from '@/types/order';
import * as orderService from '@/lib/services/orderService';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/services/emailService';
import { deliverOrder } from '@/lib/services/deliveryService';

/**
 * Shared "NOWPayments confirmed" processor used by BOTH the IPN webhook and the
 * admin simulation endpoint, so they behave identically.
 *
 * Marks not-yet-paid orders paid (+ paid_at), sends confirmation/admin emails
 * once, then triggers the existing variant-aware deliverOrder for each order.
 *
 * Idempotent:
 *  - Orders already `paid` are skipped for the status update + emails.
 *  - deliverOrder() skips orders already `delivered`, so credentials are never
 *    sent twice and stock is never double-assigned.
 */
export async function processPaidNowPaymentsOrders(
  orders: Order[],
  providerPaymentId?: string
): Promise<void> {
  if (orders.length === 0) return;

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
    newlyPaid.flatMap((o) => [
      sendOrderConfirmation({ ...o, payment_status: 'paid' }),
      sendAdminNotification(o),
    ])
  );

  // Automatic delivery for every order (deliverOrder re-reads fresh state and
  // guards already-delivered orders, so repeats never re-send credentials).
  await Promise.allSettled(orders.map((o) => deliverOrder(o.id, false)));
}
