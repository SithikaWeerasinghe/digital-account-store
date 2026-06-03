import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import { deliverOrder } from '@/lib/services/deliveryService';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/deliver
 * Manually trigger delivery for an order.
 * skipPaymentCheck=true allows admin to deliver without confirmed payment.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    // Admin can force delivery without payment confirmation
    const result = await deliverOrder(id, true);

    const statusCode = result.success ? 200 : 400;
    return NextResponse.json({ success: result.success, data: result }, { status: statusCode });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to deliver order' },
      { status: 500 }
    );
  }
}
