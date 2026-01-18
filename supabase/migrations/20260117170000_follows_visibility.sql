-- Migration: Add follows table and experience visibility
-- Date: 2026-01-17

-- ============================================
-- 1. Create follows table
-- ============================================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  -- Prevent users from following themselves
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at DESC);

-- Enable Row Level Security
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows table
-- Anyone can read follows (to see followers/following counts)
CREATE POLICY "Anyone can read follows" ON follows
  FOR SELECT USING (true);

-- Users can only create follows where they are the follower
CREATE POLICY "Users can create own follows" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Users can only delete follows where they are the follower
CREATE POLICY "Users can delete own follows" ON follows
  FOR DELETE USING (auth.uid() = follower_id);


-- ============================================
-- 2. Add visibility column to experiences table
-- ============================================

-- Add visibility column with default 'public'
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

-- Add check constraint separately
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'experiences_visibility_check'
  ) THEN
    ALTER TABLE experiences ADD CONSTRAINT experiences_visibility_check
    CHECK (visibility IN ('public', 'friends_only'));
  END IF;
END $$;

-- Create index for visibility filtering
CREATE INDEX IF NOT EXISTS idx_experiences_visibility ON experiences(visibility);

-- Update existing experiences to have 'public' visibility
UPDATE experiences SET visibility = 'public' WHERE visibility IS NULL;


-- ============================================
-- 3. Update experiences RLS policies for visibility
-- ============================================

-- Drop the old "Anyone can read experiences" policy
DROP POLICY IF EXISTS "Anyone can read experiences" ON experiences;

-- Create new policy that respects visibility
-- Users can see:
-- 1. Their own experiences (any visibility)
-- 2. Public experiences from anyone
-- 3. Friends-only experiences from users they follow
CREATE POLICY "Users can read experiences based on visibility" ON experiences
  FOR SELECT USING (
    -- Own experiences
    auth.uid() = user_id
    OR
    -- Public experiences
    visibility = 'public'
    OR
    -- Friends-only from followed users
    (
      visibility = 'friends_only'
      AND EXISTS (
        SELECT 1 FROM follows
        WHERE follows.follower_id = auth.uid()
        AND follows.following_id = experiences.user_id
      )
    )
  );
