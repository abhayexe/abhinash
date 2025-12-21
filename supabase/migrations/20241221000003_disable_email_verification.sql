/*
  # Disable Email Verification and Fix Existing Users
  
  This migration manually confirms all existing users and ensures
  they can sign in without email verification.
*/

-- Manually confirm all existing users who haven't been confirmed yet
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email_confirmed_at IS NULL;

-- Update any users who might have confirmation issues
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  updated_at = now()
WHERE email_confirmed_at IS NULL OR email_confirmed_at < created_at;

-- Ensure all users are marked as confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = GREATEST(email_confirmed_at, created_at),
  updated_at = now();

-- Create profiles for any users who might not have them
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
SELECT 
  u.id,
  u.email,
  u.created_at,
  now(),
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->>'drivers_license', ''),
  COALESCE(u.raw_user_meta_data->>'address', ''),
  COALESCE(u.raw_user_meta_data->>'city', ''),
  COALESCE(u.raw_user_meta_data->>'state', ''),
  COALESCE(u.raw_user_meta_data->>'postal_code', ''),
  COALESCE(u.raw_user_meta_data->>'profile_picture_url', '')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Show summary of users
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;