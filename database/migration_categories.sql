-- ============================================================
-- Product categories (admin-manageable)
-- Moves the previously hardcoded category list into the database so admins can
-- add / edit / archive / sort categories. Products keep their existing TEXT
-- `category` value (the category name), so no product data is touched.
-- Safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed the current categories (only if missing).
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES
  ('Streaming',    'streaming',    'Entertainment subscriptions & media access', 1, true),
  ('AI Tools',     'ai-tools',     'AI assistants, writing & design tools',      2, true),
  ('Gaming',       'gaming',       'In-game items, bundles & game passes',       3, true),
  ('Software',     'software',     'License keys for essential software',        4, true),
  ('Productivity', 'productivity', 'Cloud storage, learning & work tools',       5, true)
ON CONFLICT (slug) DO NOTHING;

-- Keep updated_at fresh.
CREATE OR REPLACE FUNCTION set_categories_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_categories_updated_at();

CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- RLS: public may read ACTIVE categories only; writes via service role (admin API).
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_public_read ON categories;
CREATE POLICY categories_public_read ON categories
  FOR SELECT USING (is_active = true);

NOTIFY pgrst, 'reload schema';
