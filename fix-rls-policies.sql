-- Fix RLS policies to allow cars to be visible in listings
-- Run this in Supabase SQL Editor

-- 1. Check current policies on cars table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cars';

-- 2. Check current policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Ensure cars are visible to all authenticated users
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (available = true);

-- 4. Ensure profiles are visible for car listings
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
CREATE POLICY "Anyone can view profiles" ON profiles 
  FOR SELECT USING (true);

-- 5. Test the exact query that CarList uses
SELECT 
  c.*,
  json_build_object(
    'full_name', p.full_name,
    'profile_picture_url', p.profile_picture_url,
    'city', p.city
  ) as profiles
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE c.available = true
ORDER BY c.created_at DESC;