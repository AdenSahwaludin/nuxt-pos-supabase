import { createClient } from "@supabase/supabase-js";

// Storage client with service role for uploads (temporary workaround)
export const supabaseStorage = createClient(
  "https://mjxhddjoaoekdlhnqbhy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1ODExNCwiZXhwIjoyMDY5NzM0MTE0fQ.BUYry-FcE7BeWrRAsSSF0f4OygFCJMWRklH1I1EGhy8",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Regular client for database operations
export const supabase = createClient(
  "https://mjxhddjoaoekdlhnqbhy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeGhkZGpvYW9la2RsaG5xYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTgxMTQsImV4cCI6MjA2OTczNDExNH0.XyPUtr2KgiZwMqbz_2hS0e-UTVqhS-ucZedo0pT9Qss",
  {
    db: {
      schema: "sbs",
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
