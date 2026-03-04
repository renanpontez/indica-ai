-- =============================================
-- USER STATUS & REPORT STATUS COLUMNS
-- For admin dashboard: reports queue + flagged users
-- =============================================

-- Add status columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- Add status columns to reports table
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'actioned')),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);

-- Index for filtering reports by status
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Index for filtering users by status
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
