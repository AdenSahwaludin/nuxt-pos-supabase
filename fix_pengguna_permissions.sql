-- Bootstrap Admin and Fix RLS Policies for Pengguna Creation
-- Run this in your Supabase SQL Editor

-- STEP 1: Check current admin users
SELECT id_pengguna, nama, email, role, user_id 
FROM sbs.pengguna 
WHERE role = 'admin';

-- STEP 2: Get current authenticated user details
SELECT 
    auth.uid() as current_user_id,
    auth.email() as current_email,
    auth.role() as current_role;

-- STEP 3: Temporarily disable RLS to insert/update admin user
ALTER TABLE sbs.pengguna DISABLE ROW LEVEL SECURITY;

-- STEP 4: Update existing user to be admin or insert if needed
-- First, find the current user's record and make them admin
UPDATE sbs.pengguna 
SET role = 'admin', updated_at = NOW()
WHERE user_id = auth.uid();

-- If no record exists, you need to insert manually
-- INSERT INTO sbs.pengguna (
--     id_pengguna, 
--     nama, 
--     email, 
--     role, 
--     user_id, 
--     created_at, 
--     updated_at
-- ) VALUES (
--     '001-ADM',
--     'Admin Bootstrap', 
--     auth.email(),
--     'admin',
--     auth.uid(),
--     NOW(),
--     NOW()
-- ) ON CONFLICT (id_pengguna) DO NOTHING;

-- STEP 5: Re-enable RLS
ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create improved INSERT policy that allows admin to create users
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;

CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    -- Allow if current user is admin
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR 
    -- Allow service_role for admin operations
    auth.role() = 'service_role'
  );

-- STEP 7: Verify setup
SELECT 'Bootstrap Complete' as status;

SELECT id_pengguna, nama, email, role, user_id 
FROM sbs.pengguna 
WHERE role = 'admin';

SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;
