import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as promoService from '@/lib/services/promoService';
import { CreatePromoBannerInput } from '@/types/promo';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/promos
 * List all promo banners (priority desc, newest first).
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const banners = await promoService.getPromoBanners();
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch promo banners' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/promos
 * Create a new promo banner.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const input: CreatePromoBannerInput = {
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      banner_type: body.banner_type,
      placement: body.placement,
      cta_text: body.cta_text,
      cta_link: body.cta_link,
      image_url: body.image_url,
      background_style: body.background_style,
      priority: body.priority,
      is_active: body.is_active,
      starts_at: body.starts_at,
      expires_at: body.expires_at,
    };

    const banner = await promoService.createPromoBanner(input);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create promo banner' },
      { status: 400 }
    );
  }
}
