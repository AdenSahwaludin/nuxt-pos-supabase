import { defineStore } from "pinia";
import { supabase } from "~/lib/supabaseClient";

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

        if (isEmail) {
          // Sign in with email
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
          });
          if (error) throw error;

          this.user = data.user;
          await this.loadProfile();
        } else {
          // Sign in with user ID - need to get email first
          const { data: userData, error: userError } = await supabase
            .from("sbs.pengguna")
            .select("email")
            .eq("id_pengguna", identifier)
            .single();

          if (userError || !userData?.email) {
            throw new Error("User ID tidak ditemukan");
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password,
          });
          if (error) throw error;

          this.user = data.user;
          await this.loadProfile();
        }
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      try {
        await supabase.auth.signOut();
        this.user = null;
        this.profile = null;
      } finally {
        this.loading = false;
      }
    },

    async loadProfile() {
      const uid = (await supabase.auth.getUser()).data.user?.id;
      if (!uid) return;

      const { data } = await supabase
        .from("sbs_pengguna_view")
        .select("*")
        .single();
      this.profile = data;
    },

    async initAuth() {
      this.loading = true;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          this.user = user;
          await this.loadProfile();
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
