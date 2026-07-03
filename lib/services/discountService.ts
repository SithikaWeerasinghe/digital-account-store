import { supabaseAdmin } from '@/lib/supabase';
import {
  DiscountCode,
  CreateDiscountCodeInput,
  UpdateDiscountCodeInput,
  ApplyDiscountResult,
} from '@/types/discount';

const VALID_TYPES = ['percentage', 'fixed'] as const;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Admin: fetch all discount codes, newest first. */
export async function getDiscountCodes(): Promise<DiscountCode[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[discountService] Failed to fetch codes:', error);
    return [];
  }
  return (data as DiscountCode[]) || [];
}

/** Admin: create a new coupon. */
export async function createDiscountCode(input: CreateDiscountCodeInput): Promise<DiscountCode> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  if (!input.code || !input.code.trim()) throw new Error('Coupon code is required');
  if (!VALID_TYPES.includes(input.discount_type)) {
    throw new Error('Discount type must be "percentage" or "fixed"');
  }
  const value = Number(input.discount_value);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Discount value must be a number greater than 0');
  }
  if (input.discount_type === 'percentage' && value > 100) {
    throw new Error('Percentage discount cannot exceed 100');
  }

  const row = {
    code: normalizeCode(input.code),
    description: input.description ?? null,
    discount_type: input.discount_type,
    discount_value: value,
    min_order_amount: input.min_order_amount != null ? Number(input.min_order_amount) : 0,
    max_discount_amount: input.max_discount_amount != null ? Number(input.max_discount_amount) : null,
    usage_limit: input.usage_limit != null ? Number(input.usage_limit) : null,
    used_count: 0,
    is_active: input.is_active ?? true,
    starts_at: input.starts_at || null,
    expires_at: input.expires_at || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('discount_codes')
    .insert(row)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('A coupon with this code already exists');
    throw new Error(`Failed to create coupon: ${error.message}`);
  }
  return data as DiscountCode;
}

/** Admin: edit an existing coupon. */
export async function updateDiscountCode(
  id: string,
  input: UpdateDiscountCodeInput
): Promise<DiscountCode> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const patch: Record<string, any> = { updated_at: new Date().toISOString() };

  if (input.code !== undefined) {
    if (!input.code || !input.code.trim()) throw new Error('Coupon code cannot be empty');
    patch.code = normalizeCode(input.code);
  }
  if (input.description !== undefined) patch.description = input.description;
  if (input.discount_type !== undefined) {
    if (!VALID_TYPES.includes(input.discount_type)) {
      throw new Error('Discount type must be "percentage" or "fixed"');
    }
    patch.discount_type = input.discount_type;
  }
  if (input.discount_value !== undefined) {
    const value = Number(input.discount_value);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Discount value must be a number greater than 0');
    }
    patch.discount_value = value;
  }
  if (input.min_order_amount !== undefined) {
    patch.min_order_amount = input.min_order_amount != null ? Number(input.min_order_amount) : 0;
  }
  if (input.max_discount_amount !== undefined) {
    patch.max_discount_amount =
      input.max_discount_amount != null ? Number(input.max_discount_amount) : null;
  }
  if (input.usage_limit !== undefined) {
    patch.usage_limit = input.usage_limit != null ? Number(input.usage_limit) : null;
  }
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (input.starts_at !== undefined) patch.starts_at = input.starts_at || null;
  if (input.expires_at !== undefined) patch.expires_at = input.expires_at || null;

  const { data, error } = await supabaseAdmin
    .from('discount_codes')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('A coupon with this code already exists');
    throw new Error(`Failed to update coupon: ${error.message}`);
  }
  return data as DiscountCode;
}

/**
 * Admin: delete a coupon. If it has already been used (used_count > 0) it is
 * disabled instead of deleted so historical order references stay meaningful.
 */
export async function deleteDiscountCode(id: string): Promise<{ id: string; disabled?: boolean }> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('discount_codes')
    .select('id, used_count')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(`Coupon not found: ${fetchError.message}`);

  if (existing && Number(existing.used_count) > 0) {
    const { error: updErr } = await supabaseAdmin
      .from('discount_codes')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (updErr) throw new Error(`Failed to disable coupon: ${updErr.message}`);
    return { id, disabled: true };
  }

  const { error: delErr } = await supabaseAdmin.from('discount_codes').delete().eq('id', id);
  if (delErr) throw new Error(`Failed to delete coupon: ${delErr.message}`);
  return { id };
}

/**
 * Returns the coupon row by code only if it is currently redeemable
 * (active, within its date window, and under its usage limit). Returns null
 * otherwise. Used server-side to guard order creation against tampered prices.
 */
export async function getRedeemableCoupon(code: string): Promise<DiscountCode | null> {
  if (!supabaseAdmin || !code) return null;

  const { data, error } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .eq('code', normalizeCode(code))
    .single();

  if (error || !data) return null;
  const coupon = data as DiscountCode;

  if (!coupon.is_active) return null;
  const now = Date.now();
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) return null;
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < now) return null;
  if (coupon.usage_limit != null && coupon.used_count >= coupon.usage_limit) return null;

  return coupon;
}

/**
 * Public checkout: validate a code against a cart total and compute the discount.
 * Does NOT mutate used_count.
 */
export async function validateAndCalculateDiscount(
  code: string,
  cartTotal: number
): Promise<ApplyDiscountResult> {
  const normalized = normalizeCode(code || '');
  const total = Number(cartTotal);

  if (!normalized) {
    return { valid: false, message: 'Please enter a coupon code.' };
  }
  if (!Number.isFinite(total) || total <= 0) {
    return { valid: false, message: 'Your cart total is invalid.' };
  }
  if (!supabaseAdmin) {
    return { valid: false, message: 'Coupons are not available right now.' };
  }

  const { data, error } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .eq('code', normalized)
    .single();

  if (error || !data) {
    return { valid: false, message: 'Invalid coupon code.' };
  }

  const coupon = data as DiscountCode;
  const now = Date.now();

  if (!coupon.is_active) {
    return { valid: false, message: 'This coupon is no longer active.' };
  }
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) {
    return { valid: false, message: 'This coupon is not active yet.' };
  }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < now) {
    return { valid: false, message: 'This coupon has expired.' };
  }
  if (coupon.usage_limit != null && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, message: 'This coupon has reached its usage limit.' };
  }
  if (coupon.min_order_amount != null && total < Number(coupon.min_order_amount)) {
    return {
      valid: false,
      message: `This coupon requires a minimum order of €${Number(coupon.min_order_amount).toFixed(2)}.`,
    };
  }

  let discount =
    coupon.discount_type === 'percentage'
      ? (total * Number(coupon.discount_value)) / 100
      : Number(coupon.discount_value);

  if (coupon.max_discount_amount != null && discount > Number(coupon.max_discount_amount)) {
    discount = Number(coupon.max_discount_amount);
  }
  // Never discount more than the cart total, and never go below zero.
  discount = Math.min(discount, total);
  discount = round2(Math.max(0, discount));

  const finalAmount = round2(Math.max(0, total - discount));

  return {
    valid: true,
    code: coupon.code,
    original_amount: round2(total),
    discount_amount: discount,
    final_amount: finalAmount,
    message: 'Coupon applied successfully.',
  };
}

/**
 * Increments a coupon's used_count by 1. Best-effort: logs and swallows errors
 * so a counter hiccup never breaks order creation.
 */
export async function incrementCouponUsage(code: string): Promise<void> {
  if (!supabaseAdmin || !code) return;
  const normalized = normalizeCode(code);

  try {
    const { data, error } = await supabaseAdmin
      .from('discount_codes')
      .select('id, used_count')
      .eq('code', normalized)
      .single();

    if (error || !data) return;

    await supabaseAdmin
      .from('discount_codes')
      .update({
        used_count: Number(data.used_count) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id);
  } catch (err) {
    console.error('[discountService] Failed to increment usage:', err);
  }
}
