import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as orderService from '@/lib/services/orderService';
import { processPaidNowPaymentsOrders } from '@/lib/services/nowpaymentsDelivery';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Test tools are available in development automatically, and in production only
 * when ENABLE_PAYMENT_TEST_TOOLS=true. This is the real security boundary for
 * the simulation (alongside requireAdminAuth).
 */
function testToolsEnabled(): boolean {
  return process.env.ENABLE_PAYMENT_TEST_TOOLS === 'true' || process.env.NODE_ENV !== 'production';
}

/**
 * POST /api/admin/orders/[id]/simulate-nowpayments
 *
 * Admin + test-tools only. Simulates a NOWPayments "confirmed/finished" IPN for
 * one order by running the EXACT same internal logic the real webhook uses
 * (processPaidNowPaymentsOrders): mark paid, set paid_at, deliver, mark sold,
 * send delivery email, mark delivered. Idempotent — never delivers twice.
 *
 * It does NOT bypass stock checks: delivery still goes through deliverOrder, so
 * an out-of-stock plan results in delivery_status='failed' just like production.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  if (!testToolsEnabled()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Payment test tools are disabled. Set ENABLE_PAYMENT_TEST_TOOLS=true to enable.',
      },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Run the shared confirmed-payment processor (same as the IPN webhook).
    await processPaidNowPaymentsOrders([order], `SIMULATED-${id}`);

    // Return the refreshed order so the admin UI reflects the new status.
    const updated = await orderService.getOrderById(id);
    return NextResponse.json({
      success: true,
      data: updated,
      message: `Simulated NOWPayments payment processed — payment: ${updated?.payment_status}, delivery: ${updated?.delivery_status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Simulation failed' },
      { status: 500 }
    );
  }
}
