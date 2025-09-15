// Create bucket dengan service role key
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mjxhddjoaoekdlhnqbhy.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1ODExNCwiZXhwIjoyMDY5NzM0MTE0fQ.BUYry-FcE7BeWrRAsSSF0f4OygFCJMWRklH1I1EGhy8';

// Use service role key untuk admin operations
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function createBucket() {
  try {
    console.log('🔄 Creating bucket dengan service role...');
    
    const { data, error } = await supabaseAdmin.storage.createBucket('produk-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error('❌ Create bucket failed:', error);
    } else {
      console.log('✅ Bucket created successfully!', data);
    }
    
    // List buckets untuk confirm
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (!listError) {
      console.log('📋 Available buckets:', buckets.map(b => b.name));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createBucket();