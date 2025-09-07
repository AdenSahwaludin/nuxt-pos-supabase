-- Diagnose Supabase Schema and RLS Issues
-- Run this in your Supabase SQL Editor to check current state

-- 1. Check current search_path
SHOW search_path;

-- 2. Check if sbs schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'sbs';

-- 3. Check if pengguna table exists in sbs schema
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'pengguna';

-- 4. Check RLS status on pengguna table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'sbs' AND tablename = 'pengguna';

-- 5. Check existing RLS policies
SELECT schemaname, tablename, policyname, cmd, permissive, qual, with_check
FROM pg_policies 
WHERE schemaname = 'sbs' AND tablename = 'pengguna'
ORDER BY policyname;

-- 6. Check if user has proper permissions
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'sbs' AND table_name = 'pengguna';

-- 7. Test basic select (this will show permission denied if RLS is blocking)
-- SELECT * FROM sbs.pengguna LIMIT 1;
