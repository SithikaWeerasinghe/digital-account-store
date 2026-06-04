import { NextRequest, NextResponse } from 'next/server';
import * as inventoryService from '@/lib/services/inventoryService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/inventory/count?product_id=xxx&product_option_id=yyy
 *
 * Public — returns ONLY the available stock count for a product (optionally
 * scoped to an exact option). Never exposes delivery_content, customer emails,
 * or sold credentials.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const productOptionId = searchParams.get('product_option_id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'product_id is required' },
        { status: 400 }
      );
    }

    const availableCount = await inventoryService.getAvailableInventoryCount(
      productId,
      productOptionId || undefined
    );

    return NextResponse.json({
      success: true,
      data: {
        product_id: productId,
        product_option_id: productOptionId || null,
        available_count: availableCount,
      },
    });
  } catch (error: any) {
    // Never break the product page — report 0 on error.
    console.error('[api/inventory/count] Failed:', error?.message || error);
    return NextResponse.json({
      success: true,
      data: { product_id: null, product_option_id: null, available_count: 0 },
    });
  }
}
