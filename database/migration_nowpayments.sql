-- ============================================================
-- NOWPayments (automatic crypto) support
-- Adds provider tracking columns to orders so crypto payments can be matched
-- back from the NOWPayments IPN/webhook and delivered automatically.
-- Safe to run multiple times. Does NOT touch existing order data.
-- ============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_reference text;
-- paid_at already exists for Mercado Pago, but guard it for older schemas.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_provider_payment_id ON orders(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_reference ON orders(checkout_reference);
CREATE INDEX IF NOT EXISTS idx_orders_payment_provider ON orders(payment_provider);
