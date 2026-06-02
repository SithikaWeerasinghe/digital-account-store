-- Stripe Integration Migration
-- Adds Stripe payment tracking fields to the orders table
-- Safe to run on existing databases - uses ALTER TABLE IF EXISTS with ADD COLUMN IF NOT EXISTS

-- Add Stripe session ID column
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add Stripe payment intent ID column
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add payment completion timestamp
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at);

-- Verify the migration
-- Run: SELECT * FROM orders LIMIT 1;
-- You should see the new columns: stripe_session_id, stripe_payment_intent_id, paid_at
