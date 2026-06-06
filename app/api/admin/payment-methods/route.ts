import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as paymentMethodService from '@/lib/services/paymentMethodService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/payment-methods
 * Admin-only. Returns all payment methods ordered by sort_order.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const methods = await paymentMethodService.getPaymentMethods();
    return NextResponse.json({ success: true, data: methods });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
