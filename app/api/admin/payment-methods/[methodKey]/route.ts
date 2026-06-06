import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as paymentMethodService from '@/lib/services/paymentMethodService';
import { UpdatePaymentMethodInput } from '@/types/paymentMethod';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/payment-methods/[methodKey]
 * Admin-only. Enable/disable a method and edit its message/name/description.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ methodKey: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { methodKey } = await params;
    if (!paymentMethodService.isValidMethodKey(methodKey)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const input: UpdatePaymentMethodInput = {
      display_name: body.display_name,
      description: body.description,
      is_active: body.is_active,
      maintenance_message: body.maintenance_message,
      sort_order: body.sort_order,
    };

    const method = await paymentMethodService.updatePaymentMethod(methodKey, input);
    return NextResponse.json({ success: true, data: method });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update payment method' },
      { status: 400 }
    );
  }
}
