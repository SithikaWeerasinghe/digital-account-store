import { supabaseAdmin, supabase } from '@/lib/supabase';
import {
  PromoBanner,
  PromoPlacement,
  PromoBannerType,
  CreatePromoBannerInput,
  UpdatePromoBannerInput,
} from '@/types/promo';

const VALID_TYPES: PromoBannerType[] = ['announcement', 'sale', 'featured', 'warning', 'info'];
const VALID_PLACEMENTS: PromoPlacement[] = ['home', 'products', 'checkout', 'global'];

/** Admin: fetch all banners, highest priority then newest first. */
export async function getPromoBanners(): Promise<PromoBanner[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from('promo_banners')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[promoService] Failed to fetch banners:', error);
    return [];
  }
  return (data as PromoBanner[]) || [];
}

/**
 * Public: fetch active banners for a placement. Always includes 'global' banners.
 * Filters out banners outside their start/expiry window. Sorted by priority desc.
 */
export async function getActivePromoBanners(placement: PromoPlacement): Promise<PromoBanner[]> {
  // Public reads can use the anon client; fall back to admin if anon is absent.
  const client = supabase || supabaseAdmin;
  if (!client) return [];

  const placements: string[] =
    placement === 'global' ? ['global'] : [placement, 'global'];

  const { data, error } = await client
    .from('promo_banners')
    .select('*')
    .eq('is_active', true)
    .in('placement', placements)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[promoService] Failed to fetch active banners:', error);
    return [];
  }

  const now = Date.now();
  return ((data as PromoBanner[]) || []).filter((b) => {
    if (b.starts_at && new Date(b.starts_at).getTime() > now) return false;
    if (b.expires_at && new Date(b.expires_at).getTime() < now) return false;
    return true;
  });
}

function normalizeType(type?: string): PromoBannerType {
  const t = (type || 'announcement') as PromoBannerType;
  if (!VALID_TYPES.includes(t)) {
    throw new Error(`Invalid banner type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  return t;
}

function normalizePlacement(placement?: string): PromoPlacement {
  const p = (placement || 'home') as PromoPlacement;
  if (!VALID_PLACEMENTS.includes(p)) {
    throw new Error(`Invalid placement. Must be one of: ${VALID_PLACEMENTS.join(', ')}`);
  }
  return p;
}

/** Admin: create a banner. */
export async function createPromoBanner(input: CreatePromoBannerInput): Promise<PromoBanner> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');
  if (!input.title || !input.title.trim()) throw new Error('Banner title is required');

  const row = {
    title: input.title.trim(),
    subtitle: input.subtitle ?? null,
    description: input.description ?? null,
    banner_type: normalizeType(input.banner_type),
    placement: normalizePlacement(input.placement),
    cta_text: input.cta_text ?? null,
    cta_link: input.cta_link ?? null,
    image_url: input.image_url ?? null,
    background_style: input.background_style ?? null,
    priority: input.priority != null ? Number(input.priority) : 0,
    is_active: input.is_active ?? true,
    starts_at: input.starts_at || null,
    expires_at: input.expires_at || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('promo_banners')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to create banner: ${error.message}`);
  return data as PromoBanner;
}

/** Admin: edit a banner. */
export async function updatePromoBanner(
  id: string,
  input: UpdatePromoBannerInput
): Promise<PromoBanner> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };

  if (input.title !== undefined) {
    if (!input.title || !input.title.trim()) throw new Error('Banner title cannot be empty');
    patch.title = input.title.trim();
  }
  if (input.subtitle !== undefined) patch.subtitle = input.subtitle;
  if (input.description !== undefined) patch.description = input.description;
  if (input.banner_type !== undefined) patch.banner_type = normalizeType(input.banner_type);
  if (input.placement !== undefined) patch.placement = normalizePlacement(input.placement);
  if (input.cta_text !== undefined) patch.cta_text = input.cta_text;
  if (input.cta_link !== undefined) patch.cta_link = input.cta_link;
  if (input.image_url !== undefined) patch.image_url = input.image_url;
  if (input.background_style !== undefined) patch.background_style = input.background_style;
  if (input.priority !== undefined) patch.priority = Number(input.priority);
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (input.starts_at !== undefined) patch.starts_at = input.starts_at || null;
  if (input.expires_at !== undefined) patch.expires_at = input.expires_at || null;

  const { data, error } = await supabaseAdmin
    .from('promo_banners')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update banner: ${error.message}`);
  return data as PromoBanner;
}

/** Admin: enable/disable a banner. */
export async function togglePromoBanner(id: string, isActive: boolean): Promise<PromoBanner> {
  return updatePromoBanner(id, { is_active: isActive });
}

/** Admin: delete a banner. */
export async function deletePromoBanner(id: string): Promise<{ id: string }> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const { error } = await supabaseAdmin.from('promo_banners').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete banner: ${error.message}`);
  return { id };
}
