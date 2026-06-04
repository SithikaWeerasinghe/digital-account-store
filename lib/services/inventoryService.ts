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
 * Finds one available inventory item, matching the exact selected product option
 * when one was chosen.
 *
 * Matching rules:
 *  - When a productOptionId is given, ONLY items with that exact option are
 *    considered. We never fall back to a different option or to generic
 *    product-level stock — that would risk sending the wrong account variant.
 *    If the order also has a guarantee, an item matching that guarantee is
 *    preferred, otherwise any item for the option (incl. items with no
 *    guarantee set) is used.
 *  - When no productOptionId is given (simple products / legacy orders), only
 *    product-level items (product_option_id IS NULL) are used. Legacy inventory
 *    created before variant support has a NULL option, so it still works.
 */
export async function getAvailableInventoryItem(
  productId: string,
  productOptionId?: string | null,
  guaranteeId?: string | null
): Promise<InventoryItem | null> {
  if (!supabaseAdmin) return null;

  const fetchOne = async (
    apply: (q: any) => any
  ): Promise<InventoryItem | null> => {
    let query = supabaseAdmin!
      .from('inventory_items')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'available');
    query = apply(query);
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
  };

  // Variant order: exact option match, no cross-option fallback.
  if (productOptionId) {
    if (guaranteeId) {
      const exact = await fetchOne((q) =>
        q.eq('product_option_id', productOptionId).eq('guarantee_id', guaranteeId)
      );
      if (exact) return exact;
    }
    // Any item for this exact option (guarantee not required).
    return fetchOne((q) => q.eq('product_option_id', productOptionId));
  }

  // Simple / legacy order: product-level stock only.
  return fetchOne((q) => q.is('product_option_id', null));
}

/**
 * Counts available inventory for a product, scoped to an exact option when given.
 * Returns 0 on any error. Never exposes item contents.
 */
export async function getAvailableInventoryCount(
  productId: string,
  productOptionId?: string | null
): Promise<number> {
  if (!supabaseAdmin || !productId) return 0;

  let query = supabaseAdmin
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)
    .eq('status', 'available');

  if (productOptionId) {
    query = query.eq('product_option_id', productOptionId);
  } else {
    query = query.is('product_option_id', null);
  }

  const { count, error } = await query;
  if (error) {
    console.error('[inventoryService] Error counting available items:', error);
    return 0;
  }
  return count ?? 0;
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
