-- ============================================================
-- Product archive support
-- Ensures products.is_active exists so products with order history can be
-- archived (soft-deleted) instead of hard-deleted, which would violate the
-- orders_product_id_fkey foreign key. Safe to run multiple times.
-- Does NOT touch orders or inventory data.
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Backfill any NULLs left by older rows so filtering is predictable.
UPDATE products SET is_active = true WHERE is_active IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
