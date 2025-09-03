import { defineStore } from "pinia";
import { supabase } from "~~/lib/supabaseClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    profile: null as any,
    loading: false,
  }),

  actions: {
    async signIn(identifier: string, password: string) {
      this.loading = true;
      try {
        // Check if identifier is email or user ID format (001-ADN)
        const isEmail = identifier.includes("@");
        let email = identifier;

        // If using ID format, get email first
        if (!isEmail) {
          const { data: userData, error } = await supabase
            .from("pengguna")
            .select("email")
            .eq("id_pengguna", identifier)
            .single();

          if (error || !userData) {
            throw new Error("ID Pengguna tidak ditemukan");
          }
          email = userData.email;
        }

        // Sign in with Supabase Auth
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) {
          throw new Error("Email/ID atau password salah");
        }

        // Get profile and role from sbs.pengguna
        const { data: profileData, error: profileError } = await supabase
          .from("pengguna")
          .select("*")
          .eq("user_id", authData.user.id)
          .single();

        if (profileError || !profileData) {
          throw new Error("Profile tidak ditemukan");
        }

        // Update last login
        await supabase
          .from("pengguna")
          .update({ terakhir_login: new Date().toISOString() })
          .eq("user_id", authData.user.id);

        // Set user and profile
        this.user = authData.user;
        this.profile = profileData;

        // Persist auth state
        this.persistAuth();
      } catch (error: any) {
        console.error("Login error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      try {
        // Sign out from Supabase Auth
        await supabase.auth.signOut();

        this.user = null;
        this.profile = null;
        // Clear stored session data
        if (process.client) {
          localStorage.removeItem("auth-user");
          localStorage.removeItem("auth-profile");
        }
        // Redirect to login page
        await navigateTo("/");
      } finally {
        this.loading = false;
      }
    },

    async loadProfile() {
      const uid = this.user?.id;
      if (!uid) return;

      try {
        const { data, error } = await supabase
          .from("pengguna")
          .select("*")
          .eq("user_id", uid)
          .single();

        if (error) {
          console.error("Error loading profile:", error);
          return;
        }

        this.profile = data;
      } catch (error) {
        console.error("Error in loadProfile:", error);
      }
    },

    async initAuth() {
      this.loading = true;
      console.log("🔧 Initializing auth...");
      
      try {
        // First, try to get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        console.log("📡 Supabase session:", session?.user?.id);

        if (session?.user) {
          this.user = session.user;

          // Get profile from sbs.pengguna
          const { data: profileData, error } = await supabase
            .from("pengguna")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (!error && profileData) {
            this.profile = profileData;
            this.persistAuth();
            console.log("✅ Auth restored from Supabase:", profileData.role);
            return; // Exit early if successful
          } else {
            console.log("❌ Profile not found for user:", session.user.id);
          }
        }

        // Fallback: try to restore from localStorage if Supabase session is not available
        if (process.client) {
          const storedUser = localStorage.getItem("auth-user");
          const storedProfile = localStorage.getItem("auth-profile");
          console.log("💾 Checking localStorage...", !!storedUser, !!storedProfile);

          if (storedUser && storedProfile) {
            const userData = JSON.parse(storedUser);
            const profileData = JSON.parse(storedProfile);

            // Validate that the stored session is still valid by checking database
            const { data: currentProfile, error } = await supabase
              .from("pengguna")
              .select("*")
              .eq("user_id", userData.id)
              .single();

            if (!error && currentProfile) {
              this.user = userData;
              this.profile = currentProfile;
              this.persistAuth();
              console.log("✅ Auth restored from localStorage:", currentProfile.role);
              return;
            } else {
              console.log("❌ Stored session invalid, clearing...");
            }
          }
        }

        // If we get here, no valid session found - clear everything
        console.log("🧹 No valid session found, clearing auth...");
        await this.clearAuth();
      } catch (error) {
        console.error("💥 Error initializing auth:", error);
        await this.clearAuth();
      } finally {
        this.loading = false;
        console.log("🏁 Auth initialization complete. User:", !!this.user, "Role:", this.profile?.role);
      }
    },

    async clearAuth() {
      this.user = null;
      this.profile = null;
      if (process.client) {
        localStorage.removeItem("auth-user");
        localStorage.removeItem("auth-profile");
      }
    },

    // Helper to persist auth state
    persistAuth() {
      if (process.client) {
        if (this.user)
          localStorage.setItem("auth-user", JSON.stringify(this.user));
        if (this.profile)
          localStorage.setItem("auth-profile", JSON.stringify(this.profile));
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.profile?.role,
    isAdmin: (state) => state.profile?.role === "admin",
    isKasir: (state) => state.profile?.role === "kasir",
  },
});
