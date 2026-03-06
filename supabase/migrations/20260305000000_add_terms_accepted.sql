-- Add terms_accepted_at column to track when users accepted the Terms of Use
ALTER TABLE users ADD COLUMN terms_accepted_at TIMESTAMPTZ;
