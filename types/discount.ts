export type DiscountType = 'percentage' | 'fixed';

export interface DiscountCode {
  id: string;
  code: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number | null;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  is_active: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Input accepted when an admin creates a coupon. */
export type CreateDiscountCodeInput = {
  code: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number | null;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  is_active?: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
};

/** Input accepted when an admin edits a coupon (all fields optional). */
export type UpdateDiscountCodeInput = Partial<CreateDiscountCodeInput>;

/** Result returned by validateAndCalculateDiscount / the public validate API. */
export interface ApplyDiscountResult {
  valid: boolean;
  code?: string;
  discount_amount?: number;
  original_amount?: number;
  final_amount?: number;
  message?: string;
}
