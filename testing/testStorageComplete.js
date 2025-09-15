// Test storage upload dengan berbagai metode
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mjxhddjoaoekdlhnqbhy.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MDc3MDAsImV4cCI6MjA0MTI4MzcwMH0.XaxVp_TD-3xMqU8rAJXTOJY50UwQ1BU7gV7VcbKEVEc';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTcwNzcwMCwiZXhwIjoyMDQxMjgzNzAwfQ.nMh_hmVJJ2o4Q-TvnV1rPHuNrqAcKz_A0SBpK9LRhWQ';

const supabaseAnon = createClient(supabaseUrl, anonKey);
const supabaseService = createClient(supabaseUrl, serviceKey);

async function testStorageSetup() {
  console.log('🧪 Testing Storage Setup...\n');

  // Test 1: List buckets
  console.log('1️⃣ Testing bucket access...');
  try {
    const { data: buckets, error } = await supabaseService.storage.listBuckets();
    if (error) throw error;
    
    const produkBucket = buckets.find(b => b.name === 'produk-images');
    if (produkBucket) {
      console.log('✅ produk-images bucket exists');
      console.log(`   Public: ${produkBucket.public}`);
    } else {
      console.log('❌ produk-images bucket not found');
      return;
    }
  } catch (error) {
    console.log('❌ Bucket list error:', error.message);
    return;
  }

  // Test 2: Check if we can create a test file
  console.log('\n2️⃣ Testing file upload...');
  const testFileName = `test_${Date.now()}.txt`;
  const testFile = new File(['test content'], testFileName, { type: 'text/plain' });

  try {
    // Try with anon client (should fail if policies are correct)
    console.log('   Testing anon upload (should fail)...');
    const { error: anonError } = await supabaseAnon.storage
      .from('produk-images')
      .upload(testFileName, testFile);
    
    if (anonError) {
      console.log('✅ Anon upload blocked (good!):', anonError.message);
    } else {
      console.log('⚠️ Anon upload succeeded (policies might be too permissive)');
    }
  } catch (error) {
    console.log('✅ Anon upload blocked:', error.message);
  }

  try {
    // Try with service role (should work)
    console.log('   Testing service role upload...');
    const { data, error } = await supabaseService.storage
      .from('produk-images')
      .upload(testFileName, testFile);
    
    if (error) {
      console.log('❌ Service upload failed:', error.message);
    } else {
      console.log('✅ Service upload succeeded');
      
      // Clean up
      await supabaseService.storage
        .from('produk-images')
        .remove([testFileName]);
      console.log('   Cleanup completed');
    }
  } catch (error) {
    console.log('❌ Service upload error:', error.message);
  }

  // Test 3: Check policies
  console.log('\n3️⃣ Checking policies...');
  try {
    const { data, error } = await supabaseService
      .from('pg_policies')
      .select('policyname, cmd')
      .eq('tablename', 'objects')
      .eq('schemaname', 'storage')
      .like('policyname', '%produk-images%');

    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log('✅ Found storage policies:');
      data.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`);
      });
    } else {
      console.log('❌ No produk-images policies found');
    }
  } catch (error) {
    console.log('⚠️ Could not check policies:', error.message);
  }

  console.log('\n🎯 Summary:');
  console.log('If you see "Service upload succeeded", the storage is working.');
  console.log('If policies are missing, run the SQL in sql/fix_storage_policies.sql');
}

testStorageSetup().catch(console.error);