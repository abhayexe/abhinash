-- Fix car owners without profiles
-- Run this in Supabase SQL Editor

-- 1. First, let's see what we're dealing with
SELECT 
  'Cars without owner profiles' as issue,
  COUNT(*) as count
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE p.id IS NULL;

-- 2. Create profiles for car owners who don't have them
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

-- 3. Verify the fix
SELECT 
  c.id as car_id,
  c.make,
  c.model,
  c.available,
  p.full_name as owner_name,
  p.email as owner_email
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
ORDER BY c.created_at DESC;