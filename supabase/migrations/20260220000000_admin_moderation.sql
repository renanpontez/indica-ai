-- Add role to users
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- Add moderation columns to experiences
ALTER TABLE experiences ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE experiences ADD CONSTRAINT experiences_status_check CHECK (status IN ('active', 'inactive'));
ALTER TABLE experiences ADD COLUMN moderation_reason TEXT;
ALTER TABLE experiences ADD COLUMN moderated_at TIMESTAMPTZ;
ALTER TABLE experiences ADD COLUMN moderated_by UUID REFERENCES users(id);

-- Backfill existing rows
UPDATE experiences SET status = 'active' WHERE status IS NULL;

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_experiences_status ON experiences(status);
