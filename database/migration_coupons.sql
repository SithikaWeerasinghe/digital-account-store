-- Migration: Coupon / Discount Code System
-- Adds the discount_codes table and discount-related columns on orders.
-- Safe to run multiple times (IF NOT EXISTS used throughout); no existing data is removed.

-- ============================================================
-- discount_codes table
-- ============================================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_discount_amount NUMERIC(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Only allow the two supported discount types.
ALTER TABLE IF EXISTS discount_codes
DROP CONSTRAINT IF EXISTS discount_codes_discount_type_check;

ALTER TABLE IF EXISTS discount_codes
ADD CONSTRAINT discount_codes_discount_type_check
CHECK (discount_type IN ('percentage', 'fixed'));

-- Indexes for fast lookups during checkout validation and admin listing.
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_is_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires_at ON discount_codes(expires_at);

-- ============================================================
-- orders: discount columns (backward compatible)
-- Existing orders keep working — these are nullable / defaulted.
-- ============================================================
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS discount_code TEXT;

ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;

ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS original_amount NUMERIC(10,2);

ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10,2);

-- Verify:
-- SELECT * FROM discount_codes ORDER BY created_at DESC;
-- SELECT id, amount, original_amount, discount_amount, final_amount, discount_code FROM orders LIMIT 5;
