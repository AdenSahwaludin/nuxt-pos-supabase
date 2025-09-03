import { supabase } from "~~/lib/supabaseClient";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Initialize auth state on app startup
  await authStore.initAuth();

  // Listen to auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event, session?.user?.id);

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
      await authStore.clearAuth();
    } else if (event === "TOKEN_REFRESHED" && session) {
      // Update user data when token is refreshed
      authStore.user = session.user;
      authStore.persistAuth();
    }
  });
});
