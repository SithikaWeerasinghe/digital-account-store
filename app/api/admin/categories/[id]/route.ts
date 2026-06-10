import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as categoryService from '@/lib/services/categoryService';
import { UpdateCategoryInput } from '@/types/category';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/categories/[id] — edit / archive / sort a category (admin). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await request.json();
    const input: UpdateCategoryInput = {
      name: body.name,
      slug: body.slug,
      icon: body.icon,
      description: body.description,
      sort_order: body.sort_order,
      is_active: body.is_active,
    };
    const category = await categoryService.updateCategory(id, input);
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: 400 }
    );
  }
}

/** DELETE /api/admin/categories/[id] — delete a category if no products use it. */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const result = await categoryService.deleteCategory(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    // Category in use → 409 Conflict with a friendly message.
    const inUse = error instanceof categoryService.CategoryInUseError || error?.code === 'in_use';
    return NextResponse.json(
      { success: false, code: inUse ? 'in_use' : 'error', message: error.message || 'Failed to delete category' },
      { status: inUse ? 409 : 400 }
    );
  }
}
