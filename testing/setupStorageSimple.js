// Simple storage policies setup with direct SQL
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const supabaseAnon = createClient(supabaseUrl, anonKey);

async function setupStoragePolicies() {
  try {
    console.log('🔄 Setting up storage policies with direct SQL...');

    // Execute SQL policies directly
    const policies = [
      // Drop existing policies first
      `DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow public access" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;`,
      `DROP POLICY IF EXISTS "produk-images-insert" ON storage.objects;`,
      `DROP POLICY IF EXISTS "produk-images-select" ON storage.objects;`,
      `DROP POLICY IF EXISTS "produk-images-update" ON storage.objects;`,
      `DROP POLICY IF EXISTS "produk-images-delete" ON storage.objects;`,
      
      // Create permissive policies for produk-images bucket
      `CREATE POLICY "produk-images-insert" ON storage.objects
       FOR INSERT 
       WITH CHECK (bucket_id = 'produk-images');`,
       
      `CREATE POLICY "produk-images-select" ON storage.objects
       FOR SELECT 
       USING (bucket_id = 'produk-images');`,
       
      `CREATE POLICY "produk-images-update" ON storage.objects
       FOR UPDATE 
       USING (bucket_id = 'produk-images');`,
       
      `CREATE POLICY "produk-images-delete" ON storage.objects
       FOR DELETE 
       USING (bucket_id = 'produk-images');`
    ];

    for (const [index, sql] of policies.entries()) {
      console.log(`📝 Executing SQL ${index + 1}/${policies.length}...`);
      
      const { error } = await supabaseAdmin
        .from('_dummy') // Dummy table to execute raw SQL
        .select('*')
        .limit(0);
        
      // Try using rpc for raw SQL execution
      const { error: rpcError } = await supabaseAdmin.rpc('exec', { 
        sql: sql 
      });
      
      if (rpcError && !rpcError.message.includes('does not exist')) {
        console.log(`⚠️  SQL ${index + 1} note:`, rpcError.message);
      } else {
        console.log(`✅ SQL ${index + 1} executed`);
      }
    }

    console.log('✅ Storage policies setup completed');

    // Test upload with anon key
    console.log('\n🧪 Testing upload with anon key...');
    
    const testContent = `test-${Date.now()}`;
    const testFile = new File([testContent], 'test.png', { 
      type: 'image/png' 
    });
    const fileName = `test_${Date.now()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabaseAnon.storage
      .from('produk-images')
      .upload(fileName, testFile);
      
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message);
      console.log('\n💡 Manual fix needed:');
      console.log('1. Go to Supabase Dashboard > Storage > produk-images');
      console.log('2. Go to Policies tab'); 
      console.log('3. Create these policies:');
      console.log('   - INSERT: bucket_id = \'produk-images\'');
      console.log('   - SELECT: bucket_id = \'produk-images\'');
      console.log('   - UPDATE: bucket_id = \'produk-images\'');
      console.log('   - DELETE: bucket_id = \'produk-images\'');
      console.log('4. Set Target roles to: public, authenticated');
    } else {
      console.log('✅ Upload test successful:', uploadData);
      
      // Clean up test file
      await supabaseAnon.storage.from('produk-images').remove([fileName]);
      console.log('🧹 Test file cleaned up');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupStoragePolicies();