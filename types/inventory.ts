export interface InventoryItem {
  id: string;
  product_id: string;
  title?: string | null;
  delivery_content: string;
  status: 'available' | 'reserved' | 'sold' | 'disabled';
  order_id?: string | null;
  customer_email?: string | null;
  sold_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateInventoryItemInput = {
  product_id: string;
  delivery_content: string;
  title?: string;
};

export type UpdateInventoryItemInput = {
  title?: string;
  delivery_content?: string;
  status?: 'available' | 'reserved' | 'sold' | 'disabled';
};
