// Supabase Storage S3-compatible client
// Alternative upload method using S3 credentials

export const uploadWithS3Credentials = async (
  file: File, 
  fileName: string, 
  bucketName: string = 'produk-images'
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use S3-compatible endpoint with credentials
    const endpoint = `https://mjxhddjoaoekdlhnqbhy.storage.supabase.co/storage/v1/object/${bucketName}/${fileName}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getS3Token()}`,
        'X-Upsert': 'true' // Allow overwrite
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    // Return public URL
    return `https://mjxhddjoaoekdlhnqbhy.storage.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;
  } catch (error: any) {
    console.error('S3 Upload Error:', error);
    throw new Error(`Failed to upload: ${error?.message || 'Unknown error'}`);
  }
};

// Generate S3 token (simplified version)
function getS3Token(): string {
  const accessKeyId = '3dd2b0d5a183130fd7730c7cfe1207cc';
  const secretAccessKey = 'fb9ea3f97e6ab1432cbf8c47382587363f49e43f6511512556e9dbd649183bcb';
  
  // For now, return as basic auth (this might need adjustment based on Supabase S3 auth)
  return btoa(`${accessKeyId}:${secretAccessKey}`);
}

export const deleteWithS3Credentials = async (
  fileName: string, 
  bucketName: string = 'produk-images'
): Promise<void> => {
  try {
    const endpoint = `https://mjxhddjoaoekdlhnqbhy.storage.supabase.co/storage/v1/object/${bucketName}/${fileName}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getS3Token()}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} ${errorText}`);
    }
  } catch (error: any) {
    console.error('S3 Delete Error:', error);
    throw new Error(`Failed to delete: ${error?.message || 'Unknown error'}`);
  }
};