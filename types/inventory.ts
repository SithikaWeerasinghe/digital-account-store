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
  // Variant-based inventory: links stock to the exact selected option/guarantee.
  product_option_id?: string | null;
  product_option_label?: string | null;
  guarantee_id?: string | null;
  guarantee_label?: string | null;
  /** Per-item "how to use" text included in the delivery email. */
  usage_instructions?: string | null;
}

export type CreateInventoryItemInput = {
  product_id: string;
  delivery_content: string;
  title?: string;
  product_option_id?: string;
  product_option_label?: string;
  guarantee_id?: string;
  guarantee_label?: string;
  usage_instructions?: string | null;
};

export type UpdateInventoryItemInput = {
  title?: string;
  delivery_content?: string;
  status?: 'available' | 'reserved' | 'sold' | 'disabled';
  product_option_id?: string;
  product_option_label?: string;
  guarantee_id?: string;
  guarantee_label?: string;
  usage_instructions?: string | null;
};
