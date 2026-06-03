-- Migration: Add missing columns to inventory_items table and update status constraint
-- This migration safely adds delivery management columns and expands status values

-- Add missing columns if they don't exist
ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS customer_email TEXT;

ALTER TABLE IF EXISTS inventory_items
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update status constraint to include 'disabled' value
-- First drop the old constraint if it exists
ALTER TABLE IF EXISTS inventory_items
DROP CONSTRAINT IF EXISTS inventory_items_status_check;

-- Add new constraint with all valid status values
ALTER TABLE IF EXISTS inventory_items
ADD CONSTRAINT inventory_items_status_check
CHECK (status IN ('available', 'reserved', 'sold', 'disabled'));

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_inventory_items_order_id ON inventory_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_customer_email ON inventory_items(customer_email);

-- Verify the table structure
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns
-- WHERE table_name = 'inventory_items' ORDER BY ordinal_position;
