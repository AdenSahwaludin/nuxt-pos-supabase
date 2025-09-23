// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  components: [{ path: "~/components", pathPrefix: false }],
  compatibilityDate: "2025-07-15",
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxt/image", "@pinia/nuxt"],
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabase: {
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    // Public keys (exposed to client-side)
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_KEY,
      },
    },
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },
  typescript: { strict: true },
});
