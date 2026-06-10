-- ============================================================
-- SECURITY: Enable Row-Level Security (RLS) on all public tables
-- ============================================================
-- Fixes the Supabase warning "Table publicly accessible / RLS disabled".
--
-- How the app accesses data:
--   * ALL database access happens server-side in lib/services/* using the
--     SERVICE ROLE key (SUPABASE_SERVICE_ROLE_KEY), which BYPASSES RLS.
--   * The browser never queries Supabase directly (everything goes through
--     /api routes). The anon key is only used for admin auth sessions.
--
-- Therefore enabling RLS locks the anon/public key out of sensitive tables
-- WITHOUT breaking the app. A few tables also get an explicit public SELECT
-- policy for safe, read-only data (defense in depth).
--
-- Safe to run multiple times (DROP POLICY IF EXISTS before each CREATE).
-- Does NOT modify any data.
-- ============================================================

-- ---------- PRODUCTS: public may read active products only ----------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS products_public_read ON products;
CREATE POLICY products_public_read ON products
  FOR SELECT USING (is_active = true);
-- No public INSERT/UPDATE/DELETE (admin writes use the service role).

-- ---------- REVIEWS: public may read approved reviews only ----------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reviews_public_read ON reviews;
CREATE POLICY reviews_public_read ON reviews
  FOR SELECT USING (is_approved = true);
-- Review creation is performed server-side (service role) via /api/reviews.

-- ---------- PROMO BANNERS: public may read active banners only ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'promo_banners') THEN
    EXECUTE 'ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS promo_banners_public_read ON promo_banners';
    EXECUTE 'CREATE POLICY promo_banners_public_read ON promo_banners FOR SELECT USING (is_active = true)';
  END IF;
END $$;

-- ---------- PAYMENT METHODS: public read (re-assert; idempotent) ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'payment_methods') THEN
    EXECUTE 'ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS payment_methods_public_read ON payment_methods';
    EXECUTE 'CREATE POLICY payment_methods_public_read ON payment_methods FOR SELECT USING (true)';
  END IF;
END $$;

-- ---------- SENSITIVE TABLES: RLS on, NO public policies ----------
-- With RLS enabled and no policy, the anon key can do nothing. The service role
-- (server API) bypasses RLS, so the app keeps working. This blocks public reads
-- of credentials, customer emails, orders, tickets, coupons, and admin data.

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'discount_codes') THEN
    EXECUTE 'ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Tell PostgREST to reload the schema/policies immediately.
NOTIFY pgrst, 'reload schema';
