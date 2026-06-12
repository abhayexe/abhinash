-- Disable Email Verification for new Supabase instance
-- This allows users to sign in immediately without email confirmation

-- =============================================
-- IMPORTANT: This SQL won't work directly!
-- =============================================
-- Email verification settings must be changed in the Supabase Dashboard
-- This file is for documentation purposes only

-- =============================================
-- MANUAL STEPS TO DISABLE EMAIL VERIFICATION:
-- =============================================

-- 1. Go to your Supabase Dashboard:
--    https://supabase.com/dashboard/project/tptzndshdlzwezopbbqy/auth/settings

-- 2. Scroll down to "Email Auth" section

-- 3. Find "Enable email confirmations" toggle

-- 4. Turn OFF "Enable email confirmations"

-- 5. Click "Save" at the bottom

-- =============================================
-- ALTERNATIVE: Use Supabase CLI (if installed)
-- =============================================

-- If you have Supabase CLI installed, you can run:
-- supabase link --project-ref tptzndshdlzwezopbbqy
-- Then update your config.toml:
-- [auth]
-- enable_signup = true
-- [auth.email]
-- enable_signup = true
-- enable_confirmations = false

-- =============================================
-- VERIFY EMAIL SETTINGS
-- =============================================

-- You can verify users after signup with this query:
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- If email_confirmed_at is NULL for new users but they can still log in,
-- then email verification is successfully disabled

-- =============================================
-- OPTIONAL: Manually confirm existing users
-- =============================================

-- If you have users that need to be confirmed manually:
-- UPDATE auth.users
-- SET 
--   email_confirmed_at = now(),
--   confirmed_at = now()
-- WHERE email_confirmed_at IS NULL;
