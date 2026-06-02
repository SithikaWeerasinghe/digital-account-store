import { NextRequest, NextResponse } from 'next/server';
import * as orderService from '@/lib/services/orderService';
import { sendOrderConfirmation, isEmailConfigured } from '@/lib/services/emailService';
import { requireAdminAuth } from '@/lib/apiAuth';

export const dynamic = 'force-dynamic';

// POST: resend the order confirmation email to the customer.
// Optional body: { credentials?: string } to include access details.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Email is not configured. Add RESEND_API_KEY to enable sending.' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const result = await sendOrderConfirmation(order, body?.credentials);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resend email' },
      { status: 500 }
    );
  }
}
