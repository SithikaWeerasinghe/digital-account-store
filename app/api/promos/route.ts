import { NextRequest, NextResponse } from 'next/server';
import * as promoService from '@/lib/services/promoService';
import { PromoPlacement } from '@/types/promo';

export const dynamic = 'force-dynamic';

const VALID_PLACEMENTS: PromoPlacement[] = ['home', 'products', 'checkout', 'global'];

/**
 * GET /api/promos?placement=home
 *
 * Public — returns active banners for the requested placement, always including
 * 'global' banners. No authentication required. Never exposes admin-only data.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = (searchParams.get('placement') || 'home').toLowerCase();
    const placement: PromoPlacement = VALID_PLACEMENTS.includes(raw as PromoPlacement)
      ? (raw as PromoPlacement)
      : 'home';

    const banners = await promoService.getActivePromoBanners(placement);
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    // Never break a public page — return an empty list on error.
    console.error('[api/promos] Failed:', error?.message || error);
    return NextResponse.json({ success: true, data: [] });
  }
}
