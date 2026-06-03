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

export async function getAvailableInventoryItem(productId: string): Promise<InventoryItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'available')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    // Not found is not an error — it just means no inventory
    if (error.code !== 'PGRST116') {
      console.error('[inventoryService] Error fetching available item:', error);
    }
    return null;
  }

  return data as InventoryItem;
}

export async function assignInventoryItemToOrder(
  productId: string,
  orderId: string,
  customerEmail: string
): Promise<InventoryItem | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not configured');

  // Get one available item for this product
  const availableItem = await getAvailableInventoryItem(productId);
  if (!availableItem) {
    return null; // No inventory available
  }

  // Atomically update: set status='sold' only if it's still 'available'
  // This prevents double-selling if two orders try to use the same item
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .update({
      status: 'sold',
      order_id: orderId,
      customer_email: customerEmail,
      sold_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
