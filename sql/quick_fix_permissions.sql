-- Quick fix for INSERT pengguna RLS policy issue
-- This allows admin users to create new pengguna records
-- Run this in your Supabase SQL Editor

-- First, check current user and their role
SELECT 
    auth.uid() as current_user_id,
    p.id_pengguna,
    p.nama,
    p.role
FROM sbs.pengguna p 
WHERE p.user_id = auth.uid();

-- Fix: Update INSERT policy to be more permissive for admin operations
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;

-- Option 1: Allow any authenticated admin to insert
-- This checks if the current user has admin role OR if this is the first user being created
CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    -- Allow if user is already an admin
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    -- Allow if this is the first user being created (bootstrap scenario)
    NOT EXISTS (SELECT 1 FROM sbs.pengguna WHERE role = 'admin')
    OR
    -- Allow service role (for admin operations)
    auth.role() = 'service_role'
  );

-- Alternative: Temporarily disable RLS for initial setup if needed
-- ALTER TABLE sbs.pengguna DISABLE ROW LEVEL SECURITY;
-- -- Insert your admin user manually
-- -- Then re-enable RLS
-- ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- Verify the policy
SELECT schemaname, tablename, policyname, cmd, with_check
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna' AND policyname = 'sbs_admin_insert_pengguna';
