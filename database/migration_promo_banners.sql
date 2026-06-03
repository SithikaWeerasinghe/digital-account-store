-- Migration: Store Advertising / Promo Banner System
-- Adds the promo_banners table. Does not touch any existing tables.
-- Safe to run multiple times (IF NOT EXISTS used throughout).

CREATE TABLE IF NOT EXISTS promo_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  banner_type TEXT DEFAULT 'announcement',
  placement TEXT DEFAULT 'home',
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT,
  background_style TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restrict banner_type to the supported set.
ALTER TABLE IF EXISTS promo_banners
DROP CONSTRAINT IF EXISTS promo_banners_banner_type_check;

ALTER TABLE IF EXISTS promo_banners
ADD CONSTRAINT promo_banners_banner_type_check
CHECK (banner_type IN ('announcement', 'sale', 'featured', 'warning', 'info'));

-- Restrict placement to the supported set.
ALTER TABLE IF EXISTS promo_banners
DROP CONSTRAINT IF EXISTS promo_banners_placement_check;

ALTER TABLE IF EXISTS promo_banners
ADD CONSTRAINT promo_banners_placement_check
CHECK (placement IN ('home', 'products', 'checkout', 'global'));

-- Indexes for fast public lookups and admin sorting.
CREATE INDEX IF NOT EXISTS idx_promo_banners_is_active ON promo_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_banners_placement ON promo_banners(placement);
CREATE INDEX IF NOT EXISTS idx_promo_banners_priority ON promo_banners(priority);
CREATE INDEX IF NOT EXISTS idx_promo_banners_expires_at ON promo_banners(expires_at);

-- Verify:
-- SELECT * FROM promo_banners ORDER BY priority DESC, created_at DESC;
