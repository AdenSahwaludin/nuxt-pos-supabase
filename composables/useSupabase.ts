import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

// Use the singleton supabase client to avoid multiple instances
export const useSupabase = () => {
  return supabase;
};
