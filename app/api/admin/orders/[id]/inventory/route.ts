import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as inventoryService from '@/lib/services/inventoryService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders/[id]/inventory
 * Returns the inventory item(s) assigned to this order so admins can confirm
 * the correct account variant was delivered. Admin-only.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const items = await inventoryService.getInventoryItemsByOrder(id);
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch assigned inventory' },
      { status: 500 }
    );
  }
}
