import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as inventoryService from '@/lib/services/inventoryService';
import { UpdateInventoryItemInput } from '@/types/inventory';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/inventory/[id]
 * Update an inventory item
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

    const input: UpdateInventoryItemInput = {
      title: body.title,
      delivery_content: body.delivery_content,
      status: body.status,
      product_option_id: body.product_option_id,
      product_option_label: body.product_option_label,
      guarantee_id: body.guarantee_id,
      guarantee_label: body.guarantee_label,
      usage_instructions: body.usage_instructions,
    };

    const item = await inventoryService.updateInventoryItem(id, input);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update inventory item' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/inventory/[id]
 * Delete an inventory item (only if not sold)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await inventoryService.deleteInventoryItem(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete inventory item' },
      { status: 400 }
    );
  }
}
