-- =============================================
-- TAGS TABLE MIGRATION
-- =============================================

-- 1. CREATE TAGS TABLE (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  is_system BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- System tags must not have created_by, custom tags must have it
  CONSTRAINT tags_system_creator_check CHECK (
    (is_system = true AND created_by IS NULL) OR
    (is_system = false AND created_by IS NOT NULL)
  )
);

-- 2. CREATE INDEXES (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_is_system ON tags(is_system);
CREATE INDEX IF NOT EXISTS idx_tags_created_by ON tags(created_by) WHERE created_by IS NOT NULL;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES (drop first to be idempotent)
DROP POLICY IF EXISTS "Anyone can read system tags" ON tags;
CREATE POLICY "Anyone can read system tags" ON tags
  FOR SELECT USING (is_system = true);

DROP POLICY IF EXISTS "Users can read own custom tags" ON tags;
CREATE POLICY "Users can read own custom tags" ON tags
  FOR SELECT USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create custom tags" ON tags;
CREATE POLICY "Users can create custom tags" ON tags
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    is_system = false AND
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete own custom tags" ON tags;
CREATE POLICY "Users can delete own custom tags" ON tags
  FOR DELETE USING (
    is_system = false AND
    created_by = auth.uid()
  );

-- 5. SEED SYSTEM TAGS (~25 tags) - Use ON CONFLICT to be idempotent
INSERT INTO tags (slug, is_system) VALUES
  ('restaurant', true),
  ('cafe', true),
  ('bar', true),
  ('hotel', true),
  ('experience', true),
  ('breakfast', true),
  ('lunch', true),
  ('dinner', true),
  ('coffee', true),
  ('japanese', true),
  ('italian', true),
  ('brazilian', true),
  ('mexican', true),
  ('french', true),
  ('nightlife', true),
  ('bakery', true),
  ('brunch', true),
  ('seafood', true),
  ('vegetarian', true),
  ('vegan', true),
  ('fast-food', true),
  ('dessert', true),
  ('asian-fusion', true),
  ('american', true),
  ('chinese', true)
ON CONFLICT (slug) DO NOTHING;

-- 6. RENAME experiences.categories TO experiences.tags (if not already renamed)
DO $$
BEGIN
  -- Check if 'categories' column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'categories'
  ) THEN
    -- Rename the column
    ALTER TABLE experiences RENAME COLUMN categories TO tags;

    -- Migrate existing data (convert display names to slugs)
    UPDATE experiences SET tags = (
      SELECT array_agg(
        CASE
          WHEN elem = 'Restaurant' THEN 'restaurant'
          WHEN elem = 'Cafe' THEN 'cafe'
          WHEN elem = 'Bar' THEN 'bar'
          WHEN elem = 'Hotel' THEN 'hotel'
          WHEN elem = 'Experience' THEN 'experience'
          WHEN elem = 'Breakfast' THEN 'breakfast'
          WHEN elem = 'Lunch' THEN 'lunch'
          WHEN elem = 'Dinner' THEN 'dinner'
          WHEN elem = 'Coffee' THEN 'coffee'
          WHEN elem = 'Nightlife' THEN 'nightlife'
          WHEN elem = 'Italian' THEN 'italian'
          WHEN elem = 'Mexican' THEN 'mexican'
          WHEN elem = 'Japanese' THEN 'japanese'
          WHEN elem = 'Chinese' THEN 'chinese'
          WHEN elem = 'American' THEN 'american'
          WHEN elem = 'Asian Fusion' THEN 'asian-fusion'
          WHEN elem = 'Seafood' THEN 'seafood'
          WHEN elem = 'Vegetarian' THEN 'vegetarian'
          WHEN elem = 'Vegan' THEN 'vegan'
          WHEN elem = 'Fast Food' THEN 'fast-food'
          WHEN elem = 'Dessert' THEN 'dessert'
          WHEN elem = 'Bakery' THEN 'bakery'
          WHEN elem = 'Brunch' THEN 'brunch'
          WHEN elem = 'Brazilian' THEN 'brazilian'
          WHEN elem = 'French' THEN 'french'
          ELSE lower(replace(elem, ' ', '-'))
        END
      )
      FROM unnest(tags) AS elem
    )
    WHERE tags IS NOT NULL;

    RAISE NOTICE 'Renamed categories to tags and migrated data';
  ELSE
    RAISE NOTICE 'Column already named tags, skipping rename';
  END IF;
END $$;
