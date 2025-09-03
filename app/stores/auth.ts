import { defineStore } from "pinia";
import { supabase } from "~~/lib/supabaseClient";
import bcrypt from "bcryptjs";

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

        let userData;
        if (isEmail) {
          // Get user by email
          const { data, error } = await supabase
            .from("pengguna")
            .select("*")
            .eq("email", identifier)
            .single();

          if (error || !data) {
            throw new Error("Email tidak ditemukan");
          }
          userData = data;
        } else {
          // Get user by id_pengguna
          const { data, error } = await supabase
            .from("pengguna")
            .select("*")
            .eq("id_pengguna", identifier)
            .single();

          if (error || !data) {
            throw new Error("ID Pengguna tidak ditemukan");
          }
          userData = data;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          password,
          userData.kata_sandi
        );
        if (!isPasswordValid) {
          throw new Error("Password salah");
        }

        // Update last login
        await supabase
          .from("pengguna")
          .update({ terakhir_login: new Date().toISOString() })
          .eq("id_pengguna", userData.id_pengguna);

        // Set profile
        this.profile = userData;
        this.user = { id: userData.user_id, email: userData.email };

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
      try {
        // Try to restore from localStorage
        if (process.client) {
          const storedUser = localStorage.getItem("auth-user");
          const storedProfile = localStorage.getItem("auth-profile");

          if (storedUser && storedProfile) {
            this.user = JSON.parse(storedUser);
            this.profile = JSON.parse(storedProfile);

            // Validate session by checking if user still exists in database
            const { data, error } = await supabase
              .from("pengguna")
              .select("*")
              .eq("id_pengguna", this.profile.id_pengguna)
              .single();

            if (error || !data) {
              // Session invalid, clear storage
              this.signOut();
              return;
            }

            // Update profile with latest data
            this.profile = data;
            this.persistAuth();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid session
        this.signOut();
      } finally {
        this.loading = false;
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
