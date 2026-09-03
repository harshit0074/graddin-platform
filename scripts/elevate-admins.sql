-- ==============================================================================
-- GRADDIN PLATFORM: ELEVATE ADMIN USERS MIGRATION SCRIPT
-- ==============================================================================
-- Target Admin Accounts:
-- 1. adminaren@gmail.com
-- 2. adminaarnav@gmail.com
-- 3. adminkarunya@gmail.com
-- 4. adminharshit@gmail.com
-- ==============================================================================

-- 1. Update existing profiles table records to role 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) IN (
  'adminaren@gmail.com',
  'adminaarnav@gmail.com',
  'adminkarunya@gmail.com',
  'adminharshit@gmail.com'
);

-- 2. Ensure profiles exist for any existing auth.users matching these emails
INSERT INTO public.profiles (id, email, role, full_name, created_at)
SELECT 
  u.id,
  u.email,
  'admin',
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  NOW()
FROM auth.users u
WHERE lower(u.email) IN (
  'adminaren@gmail.com',
  'adminaarnav@gmail.com',
  'adminkarunya@gmail.com',
  'adminharshit@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 3. Update auth.users metadata role to 'admin'
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('role', 'admin')
    ELSE raw_user_meta_data || jsonb_build_object('role', 'admin')
  END
WHERE lower(email) IN (
  'adminaren@gmail.com',
  'adminaarnav@gmail.com',
  'adminkarunya@gmail.com',
  'adminharshit@gmail.com'
);
