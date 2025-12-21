-- Quick fix for all users - run this in Supabase SQL Editor
-- This will manually confirm all users so they can sign in

UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email_confirmed_at IS NULL;

-- Check the results
SELECT 
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed' 
    ELSE 'Not Confirmed' 
  END as status
FROM auth.users
ORDER BY created_at DESC;