-- Debug script to check cars and profiles
-- Run this in Supabase SQL Editor to see what's happening

-- 1. Check all cars
SELECT 
  id,
  make,
  model,
  year,
  owner_id,
  available,
  location
FROM cars
ORDER BY created_at DESC;

-- 2. Check all profiles
SELECT 
  id,
  email,
  full_name,
  city,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- 3. Check cars with their owner profiles (this is what CarList is trying to do)
SELECT 
  c.id as car_id,
  c.make,
  c.model,
  c.year,
  c.available,
  c.owner_id,
  p.full_name,
  p.profile_picture_url,
  p.city
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE c.available = true
ORDER BY c.created_at DESC;

-- 4. Check for cars without profiles
SELECT 
  c.id as car_id,
  c.make,
  c.model,
  c.owner_id,
  'Missing Profile' as issue
FROM cars c
LEFT JOIN profiles p ON c.owner_id = p.id
WHERE p.id IS NULL;

-- 5. Check auth.users vs profiles
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.full_name,
  CASE 
    WHEN p.id IS NULL THEN 'Missing Profile'
    ELSE 'Has Profile'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;