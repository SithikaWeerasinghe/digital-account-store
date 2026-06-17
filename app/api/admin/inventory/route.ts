import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as inventoryService from '@/lib/services/inventoryService';
import { CreateInventoryItemInput } from '@/types/inventory';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/inventory
 * Fetch inventory items. Optional query param: product_id
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    const items = await inventoryService.getInventoryItems(productId || undefined);
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory
 * Create a new inventory item
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Shared product + plan/option + warranty for the created item(s).
    const base = {
      product_id: body.product_id,
      title: body.title,
      product_option_id: body.product_option_id,
      product_option_label: body.product_option_label,
      guarantee_id: body.guarantee_id,
      guarantee_label: body.guarantee_label,
      usage_instructions: body.usage_instructions,
    };

    // Bulk: one row per pasted account so each becomes its own stock unit.
    if (Array.isArray(body.delivery_contents) && body.delivery_contents.length > 0) {
      const items = await inventoryService.createInventoryItemsBulk(base, body.delivery_contents);
      return NextResponse.json(
        { success: true, data: items, count: items.length },
        { status: 201 }
      );
    }

    // Single item (unchanged flow).
    const input: CreateInventoryItemInput = {
      ...base,
      delivery_content: body.delivery_content,
    };

    const item = await inventoryService.createInventoryItem(input);
    return NextResponse.json({ success: true, data: item, count: 1 }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create inventory item' },
      { status: 400 }
    );
  }
}
