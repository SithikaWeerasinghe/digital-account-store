-- ============================================================
-- Inventory-level usage instructions
-- Lets each inventory item carry its own "how to use" text, included in the
-- delivery email (falls back to the product's instructions, then a default).
-- Safe to run multiple times. Does NOT touch existing data.
-- ============================================================

ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS usage_instructions text;
