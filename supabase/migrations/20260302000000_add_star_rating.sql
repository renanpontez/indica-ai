ALTER TABLE experiences ADD COLUMN rating SMALLINT CHECK (rating >= 3 AND rating <= 5);
ALTER TABLE experiences ADD COLUMN rating_addons TEXT[] DEFAULT '{}';
CREATE INDEX idx_experiences_rating ON experiences(rating);
