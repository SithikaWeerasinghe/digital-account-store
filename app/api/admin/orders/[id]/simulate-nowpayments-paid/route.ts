import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as orderService from '@/lib/services/orderService';
import {
  isPaymentTestToolsEnabled,
  processPaidNowPaymentsOrder,
} from '@/lib/services/nowpaymentsProcessingService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/orders/[id]/simulate-nowpayments-paid
 *
 * ADMIN-ONLY TEST TOOL. Simulates a NOWPayments "confirmed/finished" IPN for a
 * single pending NOWPayments order by running the SAME internal logic the real
 * webhook uses (processPaidNowPaymentsOrder): mark paid, set paid_at, deliver,
 * mark inventory sold, send delivery email, mark delivered.
 *
 * Hard-gated: returns 403 unless ENABLE_PAYMENT_TEST_TOOLS=true, and always
 * requires admin auth. Never bypasses stock checks; never delivers twice.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Feature gate — fully disabled unless explicitly turned on.
  if (!isPaymentTestToolsEnabled()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Payment test tools are disabled. Set ENABLE_PAYMENT_TEST_TOOLS=true to enable.',
      },
      { status: 403 }
    );
  }

  // 2. Admin authentication.
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    // 3. Load + validate the order.
    const order = await orderService.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Already delivered → do nothing, no duplicate email.
    if (order.delivery_status === 'delivered') {
      return NextResponse.json({ success: true, data: order, message: 'Order is already delivered.' });
    }

    const method = order.payment_method || order.paymentMethod;
    if (method !== 'crypto' || order.payment_provider !== 'nowpayments') {
      return NextResponse.json(
        { success: false, message: 'This is not a NOWPayments crypto order.' },
        { status: 400 }
      );
    }

    if (order.payment_status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: `Order is not pending (current payment status: ${order.payment_status}).`,
        },
        { status: 400 }
      );
    }

    // 4. Run the shared confirmed-payment processor (same as the IPN webhook).
    const result = await processPaidNowPaymentsOrder(id, `SIMULATED-${id}`);

    // Payment is marked paid even if delivery failed (e.g. out of stock); the
    // admin sees the order updated plus a clear error message.
    return NextResponse.json({
      success: result.ok,
      data: result.order ?? order,
      message: result.ok
        ? result.alreadyDelivered
          ? 'Order is already delivered.'
          : 'Simulated NOWPayments payment confirmed and order delivered.'
        : result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Simulation failed' },
      { status: 500 }
    );
  }
}
