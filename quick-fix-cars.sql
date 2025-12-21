-- Quick fix for missing cars in rental listings
-- Run this in Supabase SQL Editor

-- 1. Check what cars exist and their availability
SELECT 
  id,
  make,
  model,
  year,
  available,
  owner_id,
  created_at
FROM cars 
ORDER BY created_at DESC;

-- 2. Check if profiles exist for car owners
SELECT 
  c.id as car_id,
  c.make,
  c.model,
  c.available,
  c.owner_id,
  p.id as profile_id,
  p.full_name,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING PROFILE'
    ELSE 'HAS PROFILE'
  END as profile_status
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
ORDER BY c.created_at DESC;

-- 3. Create missing profiles for car owners
INSERT INTO public.profiles (
  id, 
  email, 
  created_at, 
  updated_at,
  full_name,
  phone,
  drivers_license,
  address,
  city,
  state,
  postal_code,
  profile_picture_url
)
SELECT DISTINCT
  c.owner_id,
  u.email,
  u.created_at,
  now(),
  COALESCE(u.raw_user_meta_data->>'full_name', 'Car Owner'),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'drivers_license', ''),
  COALESCE(u.raw_user_meta_data->>'address', ''),
  COALESCE(u.raw_user_meta_data->>'city', ''),
  COALESCE(u.raw_user_meta_data->>'state', ''),
  COALESCE(u.raw_user_meta_data->>'postal_code', ''),
  COALESCE(u.raw_user_meta_data->>'profile_picture_url', '')
FROM cars c
JOIN auth.users u ON c.owner_id = u.id
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE p.id IS NULL;

-- 4. Verify all cars now have profiles
SELECT 
  c.id as car_id,
  c.make,
  c.model,
  c.available,
  p.full_name as owner_name,
  'FIXED' as status
FROM cars c
JOIN profiles p ON c.owner_id = p.id
WHERE c.available = true
ORDER BY c.created_at DESC;

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