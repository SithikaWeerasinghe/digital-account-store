import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as discountService from '@/lib/services/discountService';
import { UpdateDiscountCodeInput } from '@/types/discount';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/discounts/[id]
 * Update / edit / enable / disable a coupon.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const input: UpdateDiscountCodeInput = {
      code: body.code,
      description: body.description,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      min_order_amount: body.min_order_amount,
      max_discount_amount: body.max_discount_amount,
      usage_limit: body.usage_limit,
      is_active: body.is_active,
      starts_at: body.starts_at,
      expires_at: body.expires_at,
    };

    const code = await discountService.updateDiscountCode(id, input);
    return NextResponse.json({ success: true, data: code });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update coupon' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/discounts/[id]
 * Delete a coupon (or disable it if it has already been used).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await discountService.deleteDiscountCode(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete coupon' },
      { status: 400 }
    );
  }
}
