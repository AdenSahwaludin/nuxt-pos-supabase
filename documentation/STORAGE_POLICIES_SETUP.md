# 🔒 Storage Policies Setup - Manual Fix

## ⚡ Quick Fix - Copy & Paste SQL

**Buka Supabase Dashboard > SQL Editor** dan jalankan ini:

```sql
-- Enable RLS pada storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop policies lama jika ada
DROP POLICY IF EXISTS "produk-images-insert" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-select" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-update" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-delete" ON storage.objects;

-- Policy 1: Upload untuk authenticated users
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

-- Policy 2: View untuk semua (public access)
CREATE POLICY "produk-images-select"
ON storage.objects FOR SELECT USING (
  bucket_id = 'produk-images'
);

-- Policy 3: Update untuk authenticated users
CREATE POLICY "produk-images-update"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'produk-images'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Delete untuk authenticated users
CREATE POLICY "produk-images-delete"
ON storage.objects FOR DELETE USING (
  bucket_id = 'produk-images'
  AND auth.role() = 'authenticated'
);

-- Cek hasil
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%produk-images%';
```

**Setelah jalankan SQL diatas, test upload di aplikasi!**

### 1. Open Supabase Dashboard

- Go to https://supabase.com/dashboard
- Select your project: **mjxhddjoaoekdlhnqbhy**

### 2. Navigate to Storage

- Click **Storage** in sidebar
- Select **produk-images** bucket

### 3. Go to Policies Tab

- Click **Policies** tab in bucket settings

### 4. Create 4 Policies

#### Policy 1: INSERT (Upload Images)

```sql
CREATE POLICY "produk-images-insert"
ON storage.objects
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'produk-images'
  AND LOWER(storage.extension(name)) IN ('jpg','jpeg','png','webp')
  -- jika mau wajib folder 'public', buka baris di bawah:
  -- AND COALESCE(LOWER((storage.foldername(name))[1]), '') = 'public'
  AND auth.role() = 'authenticated'
);
```

#### Policy 2: SELECT (View Images)

```sql
CREATE POLICY "produk-images-select"
ON storage.objects FOR SELECT USING (
  -- restrict bucket
  bucket_id = 'produk-images'
  -- allow only image files
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  -- allow public access for viewing
  AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);
```

#### Policy 3: UPDATE (Modify Images)

```sql
CREATE POLICY "produk-images-update"
ON storage.objects FOR UPDATE USING (
  -- restrict bucket
  bucket_id = 'produk-images'
  -- allow only image files
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  -- to authenticated users only
  AND auth.role() = 'authenticated'
);
```

#### Policy 4: DELETE (Remove Images)

```sql
CREATE POLICY "produk-images-delete"
ON storage.objects FOR DELETE USING (
  -- restrict bucket
  bucket_id = 'produk-images'
  -- allow only image files
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  -- to authenticated users only
  AND auth.role() = 'authenticated'
);
```

### 5. Alternative: SQL Script Execution

Copy all policies above and run in **SQL Editor**:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "produk-images-insert" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-select" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-update" ON storage.objects;
DROP POLICY IF EXISTS "produk-images-delete" ON storage.objects;

-- Create new policies
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

CREATE POLICY "produk-images-select"
ON storage.objects FOR SELECT USING (
  bucket_id = 'produk-images'
  AND (
    storage."extension"(name) = 'jpg' OR
    storage."extension"(name) = 'jpeg' OR
    storage."extension"(name) = 'png' OR
    storage."extension"(name) = 'webp'
  )
  AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

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
```

### 6. Manual Dashboard Setup (Alternative)

1. Go to **Storage > produk-images > Policies**
2. Click **Add Policy**
3. Choose **Custom**
4. Copy-paste each SQL policy above one by one
5. Click **Save** for each policy

### 7. Test Upload

After setting up policies, test upload in the app:

- Go to `http://localhost:3000`
- Login as admin
- Navigate to **Produk > Tambah Produk**
- Try uploading an image

---

## 🚀 Quick Test Script

```bash
node testing/setupStorageSimple.js
```

Should show: `✅ Upload test successful` after policies are set up correctly.
