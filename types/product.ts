export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface ProductOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  badge?: string;
  is_default?: boolean;
}

export interface GuaranteeOption {
  id: string;
  label: string;
  months: number;
  total_price: number;
  monthly_price: number;
  is_default?: boolean;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  features: string[];
  inStock: boolean;
  isInstantDelivery: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
  guarantee_options?: GuaranteeOption[];
  /** False = archived/unpublished (hidden from the public site). Defaults to true. */
  is_active?: boolean;
}
