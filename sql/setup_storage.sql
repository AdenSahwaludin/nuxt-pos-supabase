-- Setup Supabase Storage for produk images

-- 1. Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produk-images', 'produk-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies for product images

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'produk-images');

-- Allow public access to view images
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'produk-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'produk-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'produk-images');

-- Alternative: If you want to restrict to admin only, use these policies instead:
-- (Comment out the above policies and use these)

/*
-- Allow only admin role to upload images
CREATE POLICY "Allow admin uploads only" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'produk-images' AND 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Allow public access to view images  
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'produk-images');

-- Allow only admin to update images
CREATE POLICY "Allow admin updates only" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'produk-images' AND 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- Allow only admin to delete images
CREATE POLICY "Allow admin deletes only" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'produk-images' AND 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);
*/
