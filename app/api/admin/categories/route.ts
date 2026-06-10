import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as categoryService from '@/lib/services/categoryService';
import { CreateCategoryInput } from '@/types/category';

export const dynamic = 'force-dynamic';

/** GET /api/admin/categories — all categories (admin). */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const categories = await categoryService.getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/** POST /api/admin/categories — create a category (admin). */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const input: CreateCategoryInput = {
      name: body.name,
      slug: body.slug,
      icon: body.icon,
      description: body.description,
      sort_order: body.sort_order,
      is_active: body.is_active,
    };
    const category = await categoryService.createCategory(input);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 400 }
    );
  }
}
