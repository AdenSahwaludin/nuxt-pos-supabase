const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase - ganti dengan URL dan service role key Anda
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseServiceKey = 'your-service-role-key'; // Service role key (bukan anon key)

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorageBucket() {
  try {
    console.log('🔄 Checking if produk-images bucket exists...');
    
    // Cek apakah bucket sudah ada
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    const existingBucket = buckets.find(bucket => bucket.id === 'produk-images');
    
    if (existingBucket) {
      console.log('✅ Bucket produk-images already exists');
      return;
    }
    
    // Buat bucket baru
    console.log('🔄 Creating produk-images bucket...');
    const { data, error } = await supabase.storage.createBucket('produk-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB in bytes
    });
    
    if (error) {
      console.error('❌ Error creating bucket:', error);
      return;
    }
    
    console.log('✅ Bucket produk-images created successfully!');
    console.log('📋 Bucket config:', data);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Test upload untuk memastikan bucket berfungsi
async function testUpload() {
  try {
    console.log('🧪 Testing upload functionality...');
    
    // Create a simple test file
    const testContent = 'test image content';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from('produk-images')
      .upload('test-file.txt', testFile);
    
    if (error) {
      console.error('❌ Test upload failed:', error);
      return false;
    }
    
    console.log('✅ Test upload successful:', data);
    
    // Clean up test file
    await supabase.storage
      .from('produk-images')
      .remove(['test-file.txt']);
    
    console.log('🧹 Test file cleaned up');
    return true;
    
  } catch (error) {
    console.error('❌ Test upload error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up Supabase Storage...\n');
  
  await setupStorageBucket();
  await testUpload();
  
  console.log('\n✨ Storage setup complete!');
}

main();