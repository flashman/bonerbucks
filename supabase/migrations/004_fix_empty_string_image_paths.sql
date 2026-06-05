-- Fix records where image_path was stored as empty string instead of NULL
-- (legacy data from Rails migration)
UPDATE records SET image_path = NULL WHERE image_path = '';

-- Prevent future empty strings
ALTER TABLE records ADD CONSTRAINT records_image_path_nonempty
  CHECK (image_path IS NULL OR image_path != '');
