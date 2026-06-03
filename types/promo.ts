export type PromoBannerType = 'announcement' | 'sale' | 'featured' | 'warning' | 'info';
export type PromoPlacement = 'home' | 'products' | 'checkout' | 'global';

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  banner_type: PromoBannerType;
  placement: PromoPlacement;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  background_style?: string | null;
  priority: number;
  is_active: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreatePromoBannerInput = {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  banner_type?: PromoBannerType;
  placement?: PromoPlacement;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  background_style?: string | null;
  priority?: number;
  is_active?: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
};

export type UpdatePromoBannerInput = Partial<CreatePromoBannerInput>;
