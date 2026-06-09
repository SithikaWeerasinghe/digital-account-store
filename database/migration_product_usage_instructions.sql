-- ============================================================
-- Product usage instructions
-- Adds an optional "how to use this product" text per product, which is
-- included in the delivery email sent to customers after payment.
-- Safe to run multiple times. Does NOT touch orders or inventory.
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS usage_instructions text;
