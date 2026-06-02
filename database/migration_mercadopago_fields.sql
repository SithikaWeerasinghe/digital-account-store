-- Mercado Pago Integration Migration
-- Adds Mercado Pago payment tracking fields to the orders table.
-- Safe to run on existing databases — uses ALTER TABLE IF EXISTS + ADD COLUMN IF NOT EXISTS.
-- Existing Stripe columns are intentionally left in place (unused, not removed).

-- Mercado Pago Checkout Pro preference id (created before redirect)
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS mercadopago_preference_id TEXT;

-- Mercado Pago payment id (set by the webhook once a payment exists)
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS mercadopago_payment_id TEXT;

-- Mercado Pago merchant order id (groups payments for a preference)
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS mercadopago_merchant_order_id TEXT;

-- Raw Mercado Pago status string (approved, rejected, pending, in_process, cancelled...)
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS mercadopago_status TEXT;

-- Payment completion timestamp (may already exist from the Stripe migration)
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Indexes for fast webhook lookups by Mercado Pago identifiers
CREATE INDEX IF NOT EXISTS idx_orders_mp_preference_id ON orders(mercadopago_preference_id);
CREATE INDEX IF NOT EXISTS idx_orders_mp_payment_id ON orders(mercadopago_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_mp_merchant_order_id ON orders(mercadopago_merchant_order_id);

-- Verify the migration:
-- Run: SELECT * FROM orders LIMIT 1;
-- You should see: mercadopago_preference_id, mercadopago_payment_id,
--                 mercadopago_merchant_order_id, mercadopago_status, paid_at
