-- ============================================================
-- Product warranty / guarantee options
-- Stores selectable warranty/guarantee options per product as JSONB so admins
-- can edit them from the product form and the storefront can show them.
-- (options column added too for forward-compatibility with the mapper.)
-- Safe to run multiple times. Does NOT touch existing data.
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS guarantee_options jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS options jsonb;
