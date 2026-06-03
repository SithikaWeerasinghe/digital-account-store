import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as discountService from '@/lib/services/discountService';
import { CreateDiscountCodeInput } from '@/types/discount';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/discounts
 * List all coupons (newest first).
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const codes = await discountService.getDiscountCodes();
    return NextResponse.json({ success: true, data: codes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/discounts
 * Create a new coupon.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const input: CreateDiscountCodeInput = {
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

    const code = await discountService.createDiscountCode(input);
    return NextResponse.json({ success: true, data: code }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create coupon' },
      { status: 400 }
    );
  }
}
