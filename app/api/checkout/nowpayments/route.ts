import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { isPaymentMethodActive } from '@/lib/services/paymentMethodService';
import {
  isNowPaymentsConfigured,
  createNowPaymentsPayment,
} from '@/lib/services/nowpaymentsService';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/checkout/nowpayments
 *
 * Body: { order_id: string, order_ids?: string[] }
 *
 * Creates a single NOWPayments invoice for the checkout's order(s), stamps the
 * shared checkout_reference + provider_payment_id (invoice id) on each order,
 * and returns the hosted invoice URL. The API key never leaves the server.
 * Payment is confirmed ONLY by the IPN webhook — never here.
 */
export async function POST(request: NextRequest) {
  try {
    // Not configured → tell the client to fall back to the manual crypto flow.
    if (!isNowPaymentsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          code: 'not_configured',
          message: 'NOWPayments is not configured.',
        },
        { status: 503 }
      );
    }

    // Maintenance guard — crypto must be active.
    if (!(await isPaymentMethodActive('crypto'))) {
      return NextResponse.json(
        {
          success: false,
          code: 'method_unavailable',
          message: 'Crypto payment is temporarily unavailable. Please choose another payment method.',
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({} as any));
    const orderId: string | undefined = body?.order_id;
    const orderIds: string[] =
      Array.isArray(body?.order_ids) && body.order_ids.length > 0
        ? body.order_ids
        : orderId
          ? [orderId]
          : [];

    if (orderIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'order_id is required' },
        { status: 400 }
      );
    }

    // Load each order in this checkout.
    const orders: Order[] = [];
    for (const id of orderIds) {
      const order = await orderService.getOrderById(id);
      if (order) orders.push(order);
    }
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Sum the discounted EUR amounts across the checkout (no double-charging).
    const amount = orders.reduce(
      (sum, o) => sum + Number(o.final_amount ?? o.amount ?? o.totalAmount ?? 0),
      0
    );
    const totalAmount = Number(amount.toFixed(2));
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const primary = orders.find((o) => o.id === orderId) ?? orders[0];
    const reference = `np_${primary.invoice_number || primary.id}_${Math.random().toString(36).substring(2, 8)}`;

    const description =
      orders.length === 1
        ? orders[0].items?.[0]?.product?.name || orders[0].product_id || 'Digital Product'
        : `${orders.length} items — ${primary.invoice_number || primary.id}`;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;

    let invoice;
    try {
      invoice = await createNowPaymentsPayment({
        reference,
        amount: totalAmount,
        orderDescription: description,
        customerEmail: primary.customer_email || primary.userId,
        siteUrl,
      });
    } catch (err: any) {
      console.error('[nowpayments checkout] Invoice creation failed:', err?.message || err);
      return NextResponse.json(
        { success: false, message: err?.message || 'Failed to create crypto payment.' },
        { status: 502 }
      );
    }

    // Stamp provider fields on every order so the IPN can match them back.
    await Promise.all(
      orders.map((order) =>
        orderService
          .updateOrderPaymentFields(order.id, {
            payment_provider: 'nowpayments',
            provider_payment_id: invoice.id,
            checkout_reference: reference,
          })
          .catch((e) =>
            console.error(`[nowpayments checkout] Failed to stamp order ${order.id}:`, e?.message || e)
          )
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoice.id,
        invoice_url: invoice.invoice_url,
        checkout_reference: reference,
      },
    });
  } catch (error: any) {
    console.error('[nowpayments checkout] Error:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create crypto payment.' },
      { status: 500 }
    );
  }
}
