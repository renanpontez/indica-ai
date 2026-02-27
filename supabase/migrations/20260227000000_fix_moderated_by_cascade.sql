-- Fix moderated_by foreign key to SET NULL on user deletion
-- Without this, deleting an admin user who moderated experiences would fail
ALTER TABLE experiences DROP CONSTRAINT IF EXISTS experiences_moderated_by_fkey;
ALTER TABLE experiences
  ADD CONSTRAINT experiences_moderated_by_fkey
  FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL;
