import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

// Use the main supabase client for storage operations
// Create a separate storage client only when service role is needed
let _supabaseStorage: any = null;

export const getSupabaseStorage = () => {
  if (!_supabaseStorage) {
    _supabaseStorage = createClient(
      "https://mjxhddjoaoekdlhnqbhy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1ODExNCwiZXhwIjoyMDY5NzM0MTE0fQ.BUYry-FcE7BeWrRAsSSF0f4OygFCJMWRklH1I1EGhy8",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return _supabaseStorage;
};

// Export the singleton instances
export const supabaseStorage = getSupabaseStorage();

// Use the main client for regular database operations
export { supabase } from "./supabaseClient";
