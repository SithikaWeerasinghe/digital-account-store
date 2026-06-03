import { NextRequest, NextResponse } from 'next/server';
import * as discountService from '@/lib/services/discountService';

export const dynamic = 'force-dynamic';

/**
 * POST /api/discounts/validate
 *
 * Public — customers validate a coupon code at checkout before paying.
 * Body: { code: string, cartTotal: number }
 *
 * Only validates and calculates the discount. It NEVER increments used_count;
 * usage is counted when the order is actually created.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const code: string = typeof body?.code === 'string' ? body.code : '';
    const cartTotal = Number(body?.cartTotal);

    const result = await discountService.validateAndCalculateDiscount(code, cartTotal);

    // Always return 200 — `valid` carries the outcome so the UI can show a
    // friendly inline message instead of treating it as a network error.
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: true,
        data: { valid: false, message: 'Could not validate the coupon. Please try again.' },
      },
      { status: 200 }
    );
  }
}
