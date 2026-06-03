import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/apiAuth';
import * as promoService from '@/lib/services/promoService';
import { UpdatePromoBannerInput } from '@/types/promo';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/promos/[id]
 * Update / edit / enable / disable a promo banner.
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

    const input: UpdatePromoBannerInput = {
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

    const banner = await promoService.updatePromoBanner(id, input);
    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update promo banner' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/promos/[id]
 * Delete a promo banner.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await promoService.deletePromoBanner(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete promo banner' },
      { status: 400 }
    );
  }
}
