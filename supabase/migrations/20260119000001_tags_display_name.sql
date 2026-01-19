-- =============================================
-- ADD DISPLAY_NAME TO TAGS TABLE
-- =============================================
-- This migration adds a display_name column to preserve the original
-- user input for custom tags, enabling proper display without translation.

-- 1. ADD DISPLAY_NAME COLUMN
ALTER TABLE tags ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 2. Set display_name for all tags (system and custom)
UPDATE tags
SET display_name = INITCAP(REPLACE(slug, '-', ' '))
WHERE display_name IS NULL;
