// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@nuxt/image",
    "@pinia/nuxt"
  ],
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
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
