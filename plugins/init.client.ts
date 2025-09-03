import { supabase } from "~/lib/supabaseClient";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Initialize auth state
  await authStore.initAuth();

  // Listen to auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      // Get profile when user signs in
      const { data: profileData } = await supabase
        .from("pengguna")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        authStore.user = session.user;
        authStore.profile = profileData;
        authStore.persistAuth();
      }
    } else if (event === "SIGNED_OUT") {
      // Clear auth state when user signs out
      authStore.user = null;
      authStore.profile = null;
      if (process.client) {
        localStorage.removeItem("auth-user");
        localStorage.removeItem("auth-profile");
      }
    }
  });
});
