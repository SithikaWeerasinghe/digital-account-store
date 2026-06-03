-- Add order metadata JSONB column for storing product options and guarantees
-- This migration adds support for storing selected product options and guarantee details
-- in a structured JSON format while maintaining backward compatibility with existing orders.

ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS order_metadata JSONB DEFAULT '{}'::jsonb;

-- Create an index for faster metadata queries if needed in the future
CREATE INDEX IF NOT EXISTS idx_orders_metadata ON orders USING gin(order_metadata);

-- Example of what order_metadata structure will look like:
-- {
--   "product_option": {
--     "id": "netflix-opt-2",
--     "label": "Premium",
--     "price": 7.7
--   },
--   "guarantee": {
--     "id": "guar-1y",
--     "label": "1 Year",
--     "months": 12,
--     "total_price": 10.2,
--     "monthly_price": 0.85
--   }
-- }
--
-- Verify the migration:
-- SELECT id, order_metadata FROM orders LIMIT 1;
-- You should see the order_metadata column present with empty '{}' default for existing orders.
