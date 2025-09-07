// plugins/supabaseAdmin.server.ts
import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(async () => {
  // Setup untuk server-side rendering
  if (process.server) {
    const config = useRuntimeConfig();

    // Regular client (anon key)
    const supabase = createClient(
      config.public.supabase.url,
      config.public.supabase.anonKey
    );

    // Admin client (service role key) - hanya jika tersedia
    let supabaseAdmin: any = null;
    if (config.supabase?.serviceRoleKey) {
      supabaseAdmin = createClient(
        config.public.supabase.url,
        config.supabase.serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }

    // Provide ke aplikasi
    return {
      provide: {
        supabase,
        supabaseAdmin,
      },
    };
  }
});
