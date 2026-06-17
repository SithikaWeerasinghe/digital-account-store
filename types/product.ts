export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
  /**
   * Optional per-plan warranty/duration choices with their OWN prices. When
   * present, the storefront shows these for this plan instead of the
   * product-level guarantee_options, so each plan can price its warranties
   * differently (e.g. "Fan + 1 Month" ≠ "Mega Fan + 1 Month"). Backward
   * compatible — omit it to use product-level / no warranties.
   */
  guarantee_options?: GuaranteeOption[];
}

export interface ProductOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  badge?: string;
  is_default?: boolean;
  /**
   * Optional per-option warranty/duration choices. When present, the storefront
   * shows these (instead of the product-level guarantee_options) for this plan,
   * so a product can control its own warranty pricing per tier. Backward
   * compatible — omit it to use product-level / generated warranties.
   */
  guarantee_options?: GuaranteeOption[];
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
  /** "How to use this product" text included in the delivery email. */
  usage_instructions?: string | null;
}
