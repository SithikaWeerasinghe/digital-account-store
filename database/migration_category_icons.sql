-- ============================================================
-- Category emoji/icon support
-- The categories.icon column already exists (see migration_categories.sql); this
-- guards it for older schemas and seeds emojis for the default categories.
-- icon is a simple TEXT field: an emoji (🎬) or a short key (e.g. "streaming").
-- Only fills empty icons, so admin-chosen icons are never overwritten.
-- Safe to run multiple times. Does NOT delete any category data.
-- ============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon text;

UPDATE categories SET icon = '🎬' WHERE slug = 'streaming'    AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = '🤖' WHERE slug = 'ai-tools'     AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = '🎮' WHERE slug = 'gaming'       AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = '💻' WHERE slug = 'software'     AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = '📄' WHERE slug = 'productivity' AND (icon IS NULL OR icon = '');

NOTIFY pgrst, 'reload schema';
