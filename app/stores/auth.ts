import { defineStore } from "pinia";
import { supabase } from "~~/lib/supabaseClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    profile: null as any,
    loading: false,
    initialized: false,
  }),

  actions: {
    async signIn(identifier: string, password: string) {
      this.loading = true;
      try {
        // Convert identifier to uppercase for consistency (003-asd becomes 003-ASD)
        const normalizedIdentifier = identifier.toUpperCase();

        // Check if identifier is email or user ID format (001-ADN)
        const isEmail = identifier.includes("@");

        let query = supabase.schema("sbs").from("pengguna").select("*");

        if (isEmail) {
          query = query.eq("email", identifier);
        } else {
          query = query.eq("id_pengguna", normalizedIdentifier);
        }

        const { data: userData, error } = await query.single();

        if (error || !userData) {
          console.error("Pengguna tidak ditemukan");
          return false;
        }

        // Verify password using bcrypt
        const bcrypt = await import("bcryptjs");
        const isPasswordValid = await bcrypt.compare(
          password,
          userData.kata_sandi
        );

        if (!isPasswordValid) {
          console.error("Password salah");
          return false;
        }

        // Update last login
        await supabase
          .schema("sbs")
          .from("pengguna")
          .update({ terakhir_login: new Date().toISOString() })
          .eq("id_pengguna", userData.id_pengguna);

        // Set user and profile (create a mock user object for compatibility)
        this.user = {
          id: userData.id_pengguna,
          email: userData.email,
        };
        this.profile = userData;

        // Persist auth state
        this.persistAuth();

        return true;
      } catch (error: any) {
        console.error("Login error:", error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      try {
        this.user = null;
        this.profile = null;
        // Clear stored session data
        if (process.client) {
          localStorage.removeItem("auth-user");
          localStorage.removeItem("auth-profile");
        }
        // Redirect to login page
        await navigateTo("/login");
      } finally {
        this.loading = false;
      }
    },

    async loadProfile() {
      const uid = this.user?.id;
      if (!uid) return;

      try {
        const { data, error } = await supabase
          .schema("sbs")
          .from("pengguna")
          .select("*")
          .eq("id_pengguna", uid)
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
      if (this.initialized) {
        return;
      }

      this.loading = true;
      console.log("🔧 Initializing custom auth...");

      try {
        // Try to restore from localStorage (custom auth system)
        if (process.client) {
          const storedUser = localStorage.getItem("auth-user");
          const storedProfile = localStorage.getItem("auth-profile");
          console.log(
            "💾 Checking localStorage...",
            !!storedUser,
            !!storedProfile
          );

          if (storedUser && storedProfile) {
            const userData = JSON.parse(storedUser);
            const profileData = JSON.parse(storedProfile);

            // Validate that the stored session is still valid by checking database
            const { data: currentProfile, error } = await supabase
              .schema("sbs")
              .from("pengguna")
              .select("*")
              .eq("id_pengguna", userData.id)
              .single();

            if (!error && currentProfile) {
              this.user = userData;
              this.profile = currentProfile;
              this.persistAuth();
              console.log(
                "✅ Auth restored from localStorage:",
                currentProfile.role
              );
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
        this.initialized = true;
        console.log(
          "🏁 Auth initialization complete. User:",
          !!this.user,
          "Role:",
          this.profile?.role
        );
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
