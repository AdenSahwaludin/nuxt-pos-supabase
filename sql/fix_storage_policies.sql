-- Setup Storage Policies for produk-images bucket
-- Run this in Supabase Dashboard > SQL Editor

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "produk-images-insert" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-select" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-update" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-delete" ON storage.objects;

-- Policy 1: Allow authenticated users to INSERT (upload) images
CREATE POLICY "produk-images-insert"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'produk-images'
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  AND auth.role() = 'authenticated'
);

-- Policy 2: Allow everyone to SELECT (view) images  
CREATE POLICY "produk-images-select"
ON storage.objects FOR SELECT USING (
  bucket_id = 'produk-images'
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
);

-- Policy 3: Allow authenticated users to UPDATE images
CREATE POLICY "produk-images-update"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'produk-images'
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to DELETE images
CREATE POLICY "produk-images-delete"
ON storage.objects FOR DELETE USING (
  bucket_id = 'produk-images'
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  AND auth.role() = 'authenticated'
);

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';