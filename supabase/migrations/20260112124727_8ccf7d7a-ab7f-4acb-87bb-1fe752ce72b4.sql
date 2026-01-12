
-- First, drop the foreign key constraint if it exists
ALTER TABLE property_analyses DROP CONSTRAINT IF EXISTS property_analyses_property_id_fkey;

-- Change property_id column from UUID to TEXT to match saved_properties and sample data
ALTER TABLE property_analyses ALTER COLUMN property_id TYPE TEXT USING property_id::TEXT;

-- Also update property_comparisons table property_ids array to be consistent
-- (Already TEXT[] array, no change needed)
