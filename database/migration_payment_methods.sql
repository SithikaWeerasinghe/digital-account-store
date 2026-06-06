-- ============================================================
-- Payment Method Maintenance System
-- Adds an admin-controlled table to enable/disable payment methods
-- (card, crypto, manual) and show a maintenance message at checkout.
-- Safe to run multiple times. Does NOT touch existing order data.
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  maintenance_message text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Restrict method_key to the supported methods (guarded so re-runs don't error).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_methods_method_key_check'
  ) THEN
    ALTER TABLE payment_methods
      ADD CONSTRAINT payment_methods_method_key_check
      CHECK (method_key IN ('card', 'crypto', 'manual'));
  END IF;
END $$;

-- Seed the three default methods (only when missing).
INSERT INTO payment_methods (method_key, display_name, description, is_active, maintenance_message, sort_order)
VALUES
  ('card',   'Card Payment',   'Pay securely using card payment.',              true, 'Card payment is temporarily unavailable. Please choose another payment method.',   1),
  ('crypto', 'Crypto Payment', 'Pay manually using crypto wallet transfer.',    true, 'Crypto payment is temporarily unavailable. Please choose another payment method.', 2),
  ('manual', 'Manual Payment', 'Place an order and complete payment manually.', true, 'Manual payment is temporarily unavailable. Please choose another payment method.', 3)
ON CONFLICT (method_key) DO NOTHING;

-- Keep updated_at fresh on changes.
CREATE OR REPLACE FUNCTION set_payment_methods_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER trg_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION set_payment_methods_updated_at();

-- Public read access (checkout needs to know which methods are active).
-- Writes happen only via the service-role key (admin API), which bypasses RLS.
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'payment_methods' AND policyname = 'payment_methods_public_read'
  ) THEN
    CREATE POLICY payment_methods_public_read
      ON payment_methods FOR SELECT
      USING (true);
  END IF;
END $$;
