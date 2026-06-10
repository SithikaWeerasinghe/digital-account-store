import { NextResponse } from 'next/server';
import * as categoryService from '@/lib/services/categoryService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 * Public — returns ACTIVE categories only (for the storefront category section
 * and product filters). Falls back to defaults so the site never breaks.
 */
export async function GET() {
  try {
    const categories = await categoryService.getActiveCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error('[api/categories] Failed:', error?.message || error);
    return NextResponse.json({ success: true, data: categoryService.DEFAULT_CATEGORIES });
  }
}
