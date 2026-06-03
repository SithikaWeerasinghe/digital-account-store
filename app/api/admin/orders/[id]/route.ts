import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { requireAdminAuth } from '@/lib/apiAuth';

export const dynamic = 'force-dynamic';

// GET a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH: update payment_status and/or delivery_status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const order = await orderService.updateOrderStatus(id, {
      payment_status: body.payment_status,
      delivery_status: body.delivery_status,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 400 }
    );
  }
}
