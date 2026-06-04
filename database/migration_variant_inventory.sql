-- Migration: Variant-Based Inventory
-- Links inventory_items to the exact selected product option/variant and guarantee.
-- Backward compatible: existing rows keep NULL option/guarantee and still work as
-- product-level fallback inventory. No existing data is deleted.
-- Safe to run multiple times.

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS product_option_id TEXT;

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS product_option_label TEXT;

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS guarantee_id TEXT;

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS guarantee_label TEXT;

-- Indexes for fast variant-aware stock lookups and assignment.
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_option_id ON inventory_items(product_option_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_option_label ON inventory_items(product_option_label);
CREATE INDEX IF NOT EXISTS idx_inventory_items_guarantee_id ON inventory_items(guarantee_id);

-- Verify:
-- SELECT id, product_id, product_option_id, product_option_label, guarantee_id, status
-- FROM inventory_items ORDER BY created_at DESC;
