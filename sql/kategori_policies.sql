-- Add RLS policies for kategori table
ALTER TABLE sbs.kategori ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read categories
CREATE POLICY IF NOT EXISTS "allow_read_kategori" ON sbs.kategori
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert categories (admin only via app logic)
CREATE POLICY IF NOT EXISTS "allow_insert_kategori" ON sbs.kategori
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update categories (admin only via app logic)
CREATE POLICY IF NOT EXISTS "allow_update_kategori" ON sbs.kategori
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete categories (admin only via app logic)
CREATE POLICY IF NOT EXISTS "allow_delete_kategori" ON sbs.kategori
  FOR DELETE TO authenticated USING (true);

-- Grant permissions
GRANT ALL ON sbs.kategori TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE sbs.kategori_id_kategori_seq TO authenticated;
