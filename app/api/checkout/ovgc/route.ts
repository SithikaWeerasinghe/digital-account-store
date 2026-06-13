import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { isPaymentMethodActive } from '@/lib/services/paymentMethodService';
import {
  isOvgcSelected,
  isOvgcConfigured,
  createOvgcCheckout,
} from '@/lib/services/ovgcPaymentService';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/checkout/ovgc — SCAFFOLD
 *
 * Body: { order_id: string, order_ids?: string[] }
 *
 * Creates a hosted OVGC card checkout for the order(s) and returns the redirect
 * URL. Until OVGC is fully implemented it returns a safe "unavailable" response
 * (never a broken session, never a faked payment). The API key stays server-side.
 *
 * Response codes the checkout client understands:
 *   provider_disabled  → OVGC is not the selected card provider (use Mercado Pago)
 *   method_unavailable → card method is on maintenance
 *   not_configured     → OVGC selected but credentials missing
 *   not_implemented    → OVGC selected + configured, but integration not finished
 */
export async function POST(request: NextRequest) {
  try {
    // If OVGC is not the chosen card provider, tell the client to use the
    // existing Mercado Pago flow. (Default CARD_PAYMENT_PROVIDER=mercadopago.)
    if (!isOvgcSelected()) {
      return NextResponse.json(
        { success: false, code: 'provider_disabled', message: 'OVGC is not the active card provider.' },
        { status: 409 }
      );
    }

    // Card method maintenance guard.
    if (!(await isPaymentMethodActive('card'))) {
      return NextResponse.json(
        {
          success: false,
          code: 'method_unavailable',
          message: 'Card payment is temporarily unavailable. Please choose another payment method.',
        },
        { status: 403 }
      );
    }

    // Missing credentials → safe unavailable (no technical detail to customer).
    if (!isOvgcConfigured()) {
      return NextResponse.json(
        {
          success: false,
          code: 'not_configured',
          message: 'Card payment is temporarily unavailable. Please choose another payment method.',
        },
        { status: 503 }
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
      return NextResponse.json({ success: false, message: 'order_id is required' }, { status: 400 });
    }

    const orders: Order[] = [];
    for (const id of orderIds) {
      const order = await orderService.getOrderById(id);
      if (order) orders.push(order);
    }
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const amount = Number(
      orders.reduce((sum, o) => sum + Number(o.final_amount ?? o.amount ?? o.totalAmount ?? 0), 0).toFixed(2)
    );
    const primary = orders.find((o) => o.id === orderId) ?? orders[0];
    const reference = `ovgc_${primary.invoice_number || primary.id}`;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;

    const result = await createOvgcCheckout({
      reference,
      amount,
      orderDescription: primary.invoice_number || primary.id,
      customerEmail: primary.customer_email || primary.userId,
      siteUrl,
    });

    if (!result.ok) {
      // not_configured | not_implemented → safe customer-facing message.
      return NextResponse.json(
        {
          success: false,
          code: result.code,
          message: 'Card payment is temporarily unavailable. Please choose another payment method.',
        },
        { status: 503 }
      );
    }

    // When implemented: stamp provider fields so the webhook can match the order.
    await Promise.all(
      orders.map((order) =>
        orderService
          .updateOrderPaymentFields(order.id, {
            payment_provider: 'ovgc',
            provider_payment_id: result.providerPaymentId,
            checkout_reference: reference,
          })
          .catch((e) => console.error(`[ovgc checkout] stamp failed for ${order.id}:`, e?.message || e))
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        checkout_url: result.checkoutUrl,
        checkout_reference: reference,
        provider_payment_id: result.providerPaymentId || null,
        order_id: primary.id,
      },
    });
  } catch (error: any) {
    // Never expose technical errors to the customer.
    console.error('[ovgc checkout] Error:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        code: 'error',
        message: 'Card payment is temporarily unavailable. Please choose another payment method.',
      },
      { status: 500 }
    );
  }
}
