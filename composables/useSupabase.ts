import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export const useSupabase = () => {
  if (!supabaseInstance) {
    const config = useRuntimeConfig();
    
    // Check if config exists and has the right structure
    const supabaseUrl = config.public?.supabase?.url;
    const supabaseKey = config.public?.supabase?.anonKey;
    
    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required. Please check your .env file and nuxt.config.ts");
    }
    
    if (!supabaseKey) {
      throw new Error("SUPABASE_KEY is required. Please check your .env file and nuxt.config.ts");
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};
