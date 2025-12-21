-- Fix the foreign key relationship between cars and profiles
-- Run this in Supabase SQL Editor

-- 1. Check if foreign key constraint exists
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('cars', 'profiles');

-- 2. Drop existing foreign key if it exists (it might be pointing to auth.users)
ALTER TABLE cars DROP CONSTRAINT IF EXISTS cars_owner_id_fkey;

-- 3. Create the proper foreign key relationship
ALTER TABLE cars 
ADD CONSTRAINT cars_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 4. Verify the relationship was created
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'cars';

-- 5. Test the join query that was failing
SELECT 
  c.*,
  p.full_name,
  p.profile_picture_url,
  p.city
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE c.available = true
LIMIT 5;