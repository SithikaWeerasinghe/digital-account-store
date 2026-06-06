import { supabase, supabaseAdmin } from '@/lib/supabase';
import {
  PaymentMethod,
  PaymentMethodKey,
  UpdatePaymentMethodInput,
} from '@/types/paymentMethod';

const VALID_KEYS: PaymentMethodKey[] = ['card', 'crypto', 'manual'];

export function isValidMethodKey(key: string): key is PaymentMethodKey {
  return VALID_KEYS.includes(key as PaymentMethodKey);
}

/**
 * Fallback list used when the payment_methods table is missing/empty or Supabase
 * is not configured. Mirrors the migration seed so checkout keeps working and
 * every method is treated as ACTIVE (fail-open) — never blocks an existing flow.
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'default-card',
    method_key: 'card',
    display_name: 'Card Payment',
    description: 'Pay securely using card payment.',
    is_active: true,
    maintenance_message: 'Card payment is temporarily unavailable. Please choose another payment method.',
    sort_order: 1,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  {
    id: 'default-crypto',
    method_key: 'crypto',
    display_name: 'Crypto Payment',
    description: 'Pay manually using crypto wallet transfer.',
    is_active: true,
    maintenance_message: 'Crypto payment is temporarily unavailable. Please choose another payment method.',
    sort_order: 2,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  {
    id: 'default-manual',
    method_key: 'manual',
    display_name: 'Manual Payment',
    description: 'Place an order and complete payment manually.',
    is_active: true,
    maintenance_message: 'Manual payment is temporarily unavailable. Please choose another payment method.',
    sort_order: 3,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
];

/** Admin: fetch all payment methods ordered by sort_order. */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return DEFAULT_PAYMENT_METHODS;

  const { data, error } = await client
    .from('payment_methods')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error('[paymentMethodService] getPaymentMethods failed:', error.message);
    return DEFAULT_PAYMENT_METHODS;
  }
  return data as PaymentMethod[];
}

/**
 * Public (checkout): fetch all methods with their active/maintenance state.
 * Returns both active and inactive so the checkout can show disabled methods
 * with their maintenance message. Falls back to defaults (all active) on error.
 */
export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  const client = supabase || supabaseAdmin;
  if (!client) return DEFAULT_PAYMENT_METHODS;

  const { data, error } = await client
    .from('payment_methods')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error('[paymentMethodService] getActivePaymentMethods failed:', error.message);
    return DEFAULT_PAYMENT_METHODS;
  }
  return data as PaymentMethod[];
}

/** Admin: update a method's active/maintenance status, message, name, etc. */
export async function updatePaymentMethod(
  methodKey: string,
  input: UpdatePaymentMethodInput
): Promise<PaymentMethod> {
  if (!isValidMethodKey(methodKey)) {
    throw new Error('Invalid payment method');
  }
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const patch: Record<string, any> = {};
  if (input.display_name !== undefined) patch.display_name = input.display_name;
  if (input.description !== undefined) patch.description = input.description;
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (input.maintenance_message !== undefined) patch.maintenance_message = input.maintenance_message;
  if (input.sort_order !== undefined) patch.sort_order = input.sort_order;

  if (Object.keys(patch).length === 0) {
    throw new Error('No fields to update');
  }

  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .update(patch)
    .eq('method_key', methodKey)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update payment method');
  }
  return data as PaymentMethod;
}

/**
 * Server-side guard used before creating an order / starting a payment.
 * Returns true when the method is active. FAIL-OPEN: if the table is missing,
 * empty, or the lookup errors, returns true so existing flows never break.
 */
export async function isPaymentMethodActive(methodKey: string): Promise<boolean> {
  if (!isValidMethodKey(methodKey)) return false;

  const client = supabaseAdmin || supabase;
  if (!client) return true; // no DB → behave as before (all methods usable)

  const { data, error } = await client
    .from('payment_methods')
    .select('is_active')
    .eq('method_key', methodKey)
    .maybeSingle();

  if (error) {
    console.error('[paymentMethodService] isPaymentMethodActive lookup failed:', error.message);
    return true; // fail-open
  }
  if (!data) return true; // not seeded yet → treat as active
  return data.is_active === true;
}

/** Convenience: the maintenance message for a method (or a sensible default). */
export async function getMaintenanceMessage(methodKey: string): Promise<string> {
  const fallback = 'This payment method is currently under maintenance. Please choose another payment method.';
  if (!isValidMethodKey(methodKey)) return fallback;
  const methods = await getActivePaymentMethods();
  const match = methods.find((m) => m.method_key === methodKey);
  return match?.maintenance_message || fallback;
}
