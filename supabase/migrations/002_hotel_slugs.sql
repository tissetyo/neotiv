-- ============================================================
-- MIGRATION: 002_hotel_slugs.sql
-- DESCRIPTION: Add custom URL slug support to hotels table
-- ============================================================

-- 1. Add slug column to hotels table (allow null initially for backfilling)
ALTER TABLE hotels ADD COLUMN slug TEXT;

-- 2. Backfill existing data with default slugs based on name, or a specific hardcoded one.
--    The seed data uses 'Hotel Merah Putih'.
UPDATE hotels 
SET slug = 'hotel-merah-putih' 
WHERE name = 'Hotel Merah Putih';

--    For any other hotels that were created manually, provide a fallback slug
UPDATE hotels 
SET slug = LOWER(REPLACE(name, ' ', '-')) || '-' || SUBSTRING(id::text FROM 1 FOR 5)
WHERE slug IS NULL;

-- 3. Now that all existing rows have slugs, make the column NOT NULL
ALTER TABLE hotels ALTER COLUMN slug SET NOT NULL;

-- 4. Enforce strict uniqueness on the slug so no two hotels share the same URL
ALTER TABLE hotels ADD CONSTRAINT hotels_slug_key UNIQUE (slug);

-- ============================================================
-- SUCCESS
-- ============================================================
