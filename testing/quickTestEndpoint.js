// testing/quickTestEndpoint.js
import { createClient } from '@supabase/supabase-js';

const testEndpoint = async () => {
  console.log('🧪 Testing admin delete endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_pengguna: 'test-123'
      })
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error response:', error);
      return;
    }

    const result = await response.json();
    console.log('✅ Success response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
};

testEndpoint();
