// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  alias: {
    // Paksa "punycode" ke paket userland, bukan builtin Node
    punycode: "punycode/",
  },
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
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
