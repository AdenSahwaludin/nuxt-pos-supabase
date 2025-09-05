-- Comprehensive fix for SBS schema and pengguna table
-- Run this STEP BY STEP in your Supabase SQL Editor

-- STEP 1: Check if data exists in public.pengguna vs sbs.pengguna
SELECT 'PUBLIC SCHEMA' as schema_name, count(*) as row_count FROM -- public.pengguna
sbs.pengguna
--error diganti sbs.pengguna dan berhsil
UNION ALL
SELECT 'SBS SCHEMA' as schema_name, count(*) as row_count FROM sbs.pengguna;

-- STEP 2: If data is in public.pengguna, migrate it to sbs.pengguna
-- First, ensure sbs.pengguna table exists (from database_setup.sql)
-- Then copy data if needed:

-- INSERT INTO sbs.pengguna (id_pengguna, nama, email, telepon, role, user_id, created_at, updated_at)
-- SELECT id_pengguna, nama, email, telepon, role, user_id, created_at, updated_at 
-- FROM public.pengguna
-- ON CONFLICT (id_pengguna) DO NOTHING;

-- STEP 3: Set default search path to include sbs first
ALTER DATABASE postgres SET search_path TO sbs, public;

-- STEP 4: Grant basic permissions to authenticated users
GRANT USAGE ON SCHEMA sbs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sbs TO authenticated;

-- STEP 5: Create comprehensive RLS policies for pengguna table
-- Drop existing policies first
DROP POLICY IF EXISTS sbs_read_all_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_update_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_insert_pengguna ON sbs.pengguna;
DROP POLICY IF EXISTS sbs_admin_delete_pengguna ON sbs.pengguna;

-- Enable RLS
ALTER TABLE sbs.pengguna ENABLE ROW LEVEL SECURITY;

-- Read policy - any authenticated user can read
CREATE POLICY sbs_read_all_pengguna ON sbs.pengguna
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admin policies for write operations
CREATE POLICY sbs_admin_update_pengguna ON sbs.pengguna
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY sbs_admin_insert_pengguna ON sbs.pengguna
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY sbs_admin_delete_pengguna ON sbs.pengguna
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sbs.pengguna 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- STEP 6: Verify setup
SELECT 'RLS Policies Created' as status;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;
