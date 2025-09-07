// server/middleware/supabase.ts
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // Skip non-API routes
  if (!event.node.req.url?.startsWith("/api/")) {
    return;
  }

  const config = useRuntimeConfig();

  // Debug logging
  console.log('🔧 Supabase middleware config check:');
  console.log('- URL:', !!(config.public.supabase as any)?.url);
  console.log('- Anon Key:', !!(config.public.supabase as any)?.anonKey);
  console.log('- Service Role:', !!(config.supabase as any)?.serviceRoleKey);

  // Regular client (anon key)
  const supabase = createClient(
    (config.public.supabase as any)?.url || '',
    (config.public.supabase as any)?.anonKey || ''
  );

  // Admin client (service role key) - hanya jika tersedia
  let supabaseAdmin: any = null;
  if ((config.supabase as any)?.serviceRoleKey) {
    supabaseAdmin = createClient(
      (config.public.supabase as any)?.url || '',
      (config.supabase as any).serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  // Attach ke event context
  event.context.supabase = supabase;
  event.context.supabaseAdmin = supabaseAdmin;
});
