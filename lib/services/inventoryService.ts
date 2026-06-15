import { supabaseAdmin } from '@/lib/supabase';
import { InventoryItem, CreateInventoryItemInput, UpdateInventoryItemInput } from '@/types/inventory';

export async function getInventoryItems(productId?: string): Promise<InventoryItem[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from('inventory_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[inventoryService] Failed to fetch items:', error);
    return [];
  }

  return data || [];
}

/** Returns the inventory item(s) assigned to a given order (admin use). */
export async function getInventoryItemsByOrder(orderId: string): Promise<InventoryItem[]> {
  if (!supabaseAdmin || !orderId) return [];

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .select('*')
    .eq('order_id', orderId)
    .order('sold_at', { ascending: false });

  if (error) {
    console.error('[inventoryService] Failed to fetch items by order:', error);
    return [];
  }
  return (data as InventoryItem[]) || [];
}

export async function createInventoryItem(input: CreateInventoryItemInput): Promise<InventoryItem> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  if (!input.product_id || !input.delivery_content) {
    throw new Error('product_id and delivery_content are required');
  }

  const newItem = {
    product_id: input.product_id,
    delivery_content: input.delivery_content,
    title: input.title || null,
    status: 'available' as const,
    product_option_id: input.product_option_id || null,
    product_option_label: input.product_option_label || null,
    guarantee_id: input.guarantee_id || null,
    guarantee_label: input.guarantee_label || null,
    usage_instructions: input.usage_instructions || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .insert(newItem)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create inventory item: ${error.message}`);
  }

  return data as InventoryItem;
}

export async function updateInventoryItem(id: string, input: UpdateInventoryItemInput): Promise<InventoryItem> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.delivery_content !== undefined) updateData.delivery_content = input.delivery_content;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.product_option_id !== undefined) updateData.product_option_id = input.product_option_id || null;
  if (input.product_option_label !== undefined) updateData.product_option_label = input.product_option_label || null;
  if (input.guarantee_id !== undefined) updateData.guarantee_id = input.guarantee_id || null;
  if (input.guarantee_label !== undefined) updateData.guarantee_label = input.guarantee_label || null;
  if (input.usage_instructions !== undefined) updateData.usage_instructions = input.usage_instructions || null;

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update inventory item: ${error.message}`);
  }

  return data as InventoryItem;
}

export async function deleteInventoryItem(id: string): Promise<{ id: string }> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  // First check if the item is sold
  const { data: item, error: fetchError } = await supabaseAdmin
    .from('inventory_items')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Item not found: ${fetchError.message}`);
  }

  if (item?.status === 'sold') {
    throw new Error('Cannot delete sold items. Mark as disabled instead.');
  }

  const { error: deleteError } = await supabaseAdmin
    .from('inventory_items')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(`Failed to delete inventory item: ${deleteError.message}`);
  }

  return { id };
}

/**
 * Applies the exact-combination scoping (option + warranty/guarantee) to a
 * query so stock is never shared across different plans or warranties.
 *
 * Symmetric, strict matching — the inventory item must belong to the SAME
 * purchasable combination the customer selected:
 *  - option:    given → product_option_id = id;   absent → product_option_id IS NULL
 *  - guarantee: given → guarantee_id = id;          absent → guarantee_id IS NULL
 *
 * This is the rule that separates inventory by product + plan + warranty.
 * "No warranty configured" is represented by NULL on both sides, so simple and
 * legacy (pre-warranty) inventory keeps matching exactly as before.
 */
function scopeToCombination(
  query: any,
  productOptionId?: string | null,
  guaranteeId?: string | null
): any {
  query = productOptionId
    ? query.eq('product_option_id', productOptionId)
    : query.is('product_option_id', null);
  query = guaranteeId
    ? query.eq('guarantee_id', guaranteeId)
    : query.is('guarantee_id', null);
  return query;
}

/**
 * Finds one available inventory item for the EXACT purchased combination of
 * product + selected option/plan + selected warranty/guarantee.
 *
 * There is intentionally NO cross-option or cross-warranty fallback: stock
 * added for "Plan X + 1 Month" must never be delivered for "Plan X + 3 Months".
 * If nothing matches the exact combination, returns null and the caller fails
 * the delivery (the admin is notified) rather than sending the wrong variant.
 */
export async function getAvailableInventoryItem(
  productId: string,
  productOptionId?: string | null,
  guaranteeId?: string | null
): Promise<InventoryItem | null> {
  if (!supabaseAdmin) return null;

  let query = supabaseAdmin
    .from('inventory_items')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'available');
  query = scopeToCombination(query, productOptionId, guaranteeId);

  const { data, error } = await query
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[inventoryService] Error fetching available item:', error);
    }
    return null;
  }
  return (data as InventoryItem) || null;
}

/**
 * Counts available inventory for the EXACT combination of product + option +
 * warranty/guarantee. Stock is never shared across different plans or
 * warranties (see scopeToCombination). Returns 0 on any error. Never exposes
 * item contents.
 */
export async function getAvailableInventoryCount(
  productId: string,
  productOptionId?: string | null,
  guaranteeId?: string | null
): Promise<number> {
  if (!supabaseAdmin || !productId) return 0;

  let query = supabaseAdmin
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)
    .eq('status', 'available');
  query = scopeToCombination(query, productOptionId, guaranteeId);

  const { count, error } = await query;
  if (error) {
    console.error('[inventoryService] Error counting available items:', error);
    return 0;
  }
  return count ?? 0;
}

/**
 * Returns whether a product/variant is inventory-tracked and how much stock is
 * currently available. Used by checkout/order creation to enforce stock limits.
 *
 * "tracked" rules (mirrors the storefront's behaviour exactly):
 *  - A variant/option order (productOptionId given) ALWAYS uses variant
 *    inventory, so tracked = true. If the exact option+warranty has no stock,
 *    available = 0.
 *  - A product where the customer selected a warranty/guarantee is likewise
 *    inventory-tracked (tracked = true), so its exact-combination stock is
 *    enforced even when the product has no plan dropdown.
 *  - A simple product (no option, no guarantee) is only tracked when at least
 *    one product-level inventory row exists. Products that don't use the
 *    inventory table at all return tracked = false and are never blocked.
 *
 * `available` is always counted for the EXACT product + option + warranty
 * combination, so a 1-month order can never consume 3-month stock.
 *
 * On any error this fails OPEN (tracked = false) so a transient DB issue can
 * never block a legitimate checkout.
 */
export async function getInventoryStockStatus(
  productId: string,
  productOptionId?: string | null,
  guaranteeId?: string | null
): Promise<{ tracked: boolean; available: number }> {
  if (!supabaseAdmin || !productId) return { tracked: false, available: 0 };

  const available = await getAvailableInventoryCount(productId, productOptionId, guaranteeId);

  // Variant/option orders, and any order that selected a warranty, are always
  // inventory-tracked for their exact combination.
  if (productOptionId || guaranteeId) return { tracked: true, available };

  // Simple product: tracked only when product-level inventory rows exist.
  const { count, error } = await supabaseAdmin
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)
    .is('product_option_id', null);

  if (error) {
    console.error('[inventoryService] Error checking inventory tracking:', error);
    return { tracked: false, available };
  }
  return { tracked: (count ?? 0) > 0, available };
}

/**
 * Dev diagnostics: returns the distinct product_option_id values that currently
 * have available stock for a product. Used to explain a 0 count caused by an
 * option-id mismatch.
 */
export async function getAvailableOptionIdsForProduct(productId: string): Promise<(string | null)[]> {
  if (!supabaseAdmin || !productId) return [];
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .select('product_option_id')
    .eq('product_id', productId)
    .eq('status', 'available');
  if (error) return [];
  return Array.from(new Set((data || []).map((r: any) => r.product_option_id ?? null)));
}

export async function assignInventoryItemToOrder(
  productId: string,
  orderId: string,
  customerEmail: string,
  productOptionId?: string | null,
  productOptionLabel?: string | null,
  guaranteeId?: string | null,
  guaranteeLabel?: string | null
): Promise<InventoryItem | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  // Get one available item matching the selected option (if any).
  const availableItem = await getAvailableInventoryItem(productId, productOptionId, guaranteeId);
  if (!availableItem) {
    return null; // No matching inventory available
  }

  // Atomically update: set status='sold' only if it's still 'available'.
  // This prevents double-selling if two orders try to use the same item.
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .update({
      status: 'sold',
      order_id: orderId,
      customer_email: customerEmail,
      sold_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Persist the option/guarantee this item was delivered for. Prefer the
      // item's own values; fall back to the order's selection for legacy items.
      product_option_id: availableItem.product_option_id ?? productOptionId ?? null,
      product_option_label: availableItem.product_option_label ?? productOptionLabel ?? null,
      guarantee_id: availableItem.guarantee_id ?? guaranteeId ?? null,
      guarantee_label: availableItem.guarantee_label ?? guaranteeLabel ?? null,
    })
    .eq('id', availableItem.id)
    .eq('status', 'available') // Atomic check: only update if still available
    .select()
    .single();

  if (error) {
    // If the update fails, the item was likely already taken
    console.error('[inventoryService] Failed to assign item (likely already sold):', error);
    return null;
  }

  return data as InventoryItem;
}
