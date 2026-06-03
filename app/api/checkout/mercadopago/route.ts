import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import {
  isMercadoPagoConfigured,
  createCheckoutPreference,
  PreferenceItemInput,
} from '@/lib/mercadopago';
import { Order } from '@/types/order';

export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout/mercadopago
 *
 * Body: { order_id: string, order_ids?: string[] }
 *
 * Creates a Mercado Pago Checkout Pro preference for the given Supabase order(s),
 * saves the preference id on each order, and returns the redirect URL(s).
 * The access token never leaves the server.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        {
          success: false,
          code: 'not_configured',
          message: 'Mercado Pago is not configured yet. Add MERCADOPAGO_ACCESS_TOKEN to enable online payment.',
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const orderId: string | undefined = body?.order_id;
    const orderIds: string[] = Array.isArray(body?.order_ids) && body.order_ids.length > 0
      ? body.order_ids
      : orderId
        ? [orderId]
        : [];

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'order_id is required' },
        { status: 400 }
      );
    }

    // Fetch every order in this checkout so each becomes a Mercado Pago line item.
    const orders: Order[] = [];
    for (const id of orderIds) {
      const order = await orderService.getOrderById(id);
      if (order) orders.push(order);
    }

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const primary = orders.find((o) => o.id === orderId) ?? orders[0];

    const items: PreferenceItemInput[] = orders.map((order) => {
      const quantity = order.quantity ?? order.items?.[0]?.quantity ?? 1;
      // Charge the discounted amount: prefer final_amount, then amount/totalAmount.
      const lineTotal =
        order.final_amount ?? order.amount ?? order.totalAmount ?? 0;
      const unitPrice = Number((lineTotal / (quantity || 1)).toFixed(2));
      const title =
        order.items?.[0]?.product?.name || order.product_id || 'Digital Product';
      return {
        id: order.product_id || order.id,
        title,
        quantity,
        unit_price: unitPrice,
      };
    });

    // Prefer the configured public site URL; fall back to the request origin.
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
      new URL(request.url).origin;

    const preference = await createCheckoutPreference({
      orderId: primary.id,
      orderIds: orders.map((o) => o.id),
      invoiceNumber: primary.invoice_number,
      customerEmail: primary.customer_email || primary.userId,
      items,
      siteUrl,
    });

    // Persist the preference id on every order in this checkout (best-effort).
    await Promise.all(
      orders.map((order) =>
        orderService
          .updateOrderPaymentFields(order.id, {
            mercadopago_preference_id: preference.id,
          })
          .catch((err) => {
            console.error(`[mercadopago] Failed to save preference id on order ${order.id}:`, err?.message || err);
          })
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        preference_id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to create Mercado Pago checkout';
    const isCurrencyError =
      message.includes('MERCADOPAGO_CURRENCY') || message.includes('Invalid MERCADOPAGO');
    // Currency-conversion / amount configuration problems (EUR → COP).
    const isConversionError =
      message.includes('EUR_TO_COP_RATE') ||
      message.includes('less than 1 COP') ||
      message.includes('Invalid order amount');
    const isConfigError = isCurrencyError || isConversionError;

    console.error('[mercadopago] Checkout preference creation failed:', message);

    return NextResponse.json(
      {
        success: false,
        message: isCurrencyError
          ? 'Invalid Mercado Pago currency configuration. Please check MERCADOPAGO_CURRENCY in environment variables.'
          : message,
        code: isConfigError ? 'invalid_currency' : 'checkout_failed',
      },
      { status: isConfigError ? 400 : 500 }
    );
  }
}
