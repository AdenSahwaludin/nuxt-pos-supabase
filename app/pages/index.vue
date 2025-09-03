<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background with gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900"
    ></div>

    <!-- Animated background shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/3 right-1/3 w-48 h-48 bg-emerald-600/15 rounded-full blur-2xl animate-pulse delay-500"
      ></div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md">
      <!-- Glass Card -->
      <div
        class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/20 p-8 transition-all duration-300 hover:shadow-3xl hover:shadow-black/30 hover:border-white/30"
      >
        <!-- Logo -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
          >
            <NuxtImg
              src="/Logo_Cap_Daun_Kayu_Putih_Transparent.png"
              alt="Logo"
              class="w-12 h-12 object-contain"
              loading="lazy"
            />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p class="text-white/70">Silakan masuk ke akun Anda</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username/Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/90">
              Username/Email
              <span class="text-emerald-400 ml-1">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10"
              >
                <!-- User icon -->
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <input
                v-model="form.identifier"
                type="text"
                placeholder="Masukkan email atau ID (001-ADN)"
                required
                class="w-full pl-12 pr-4 py-3 text-white placeholder-white/50 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg shadow-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 hover:border-white/30 transition-all duration-300"
              />
            </div>
            <p class="text-xs text-white/60">
              Gunakan email atau format ID: 001-ADN
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/90">
              Password
              <span class="text-emerald-400 ml-1">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10"
              >
                <!-- Lock icon -->
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                required
                class="w-full pl-12 pr-12 py-3 text-white placeholder-white/50 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg shadow-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 hover:border-white/30 transition-all duration-300"
              />
              <!-- Show/Hide password toggle -->
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                @click="showPassword = !showPassword"
              >
                <!-- Eye icon (show) -->
                <svg
                  v-if="showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <!-- Eye slash icon (hide) -->
                <!-- Eye slash icon (hide) -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <!-- Mata lonjong -->
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.642-4.362m3.507-2.118A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.6 2.773M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <!-- Garis miring -->
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3l18 18"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="p-3 rounded-lg bg-red-500/20 border border-red-400/50 backdrop-blur-sm"
          >
            <p class="text-red-300 text-sm">{{ error }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full overflow-hidden px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/30 backdrop-blur-md rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-400/50 hover:from-emerald-500/40 hover:to-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <!-- Loading spinner -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm"
            >
              <div
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
            </div>

            <!-- Button text -->
            <span :class="{ 'opacity-0': loading }"> Masuk </span>

            <!-- Shine effect on hover -->
            <div
              class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            ></div>
          </button>

          <!-- Remove Forgot Password Link -->
          <!-- <div class="text-center">
            <button
              type="button"
              class="text-emerald-300 hover:text-emerald-200 text-sm transition-colors duration-200 hover:underline"
              @click="handleForgotPassword"
            >
              Lupa password?
            </button>
          </div> -->
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-white/10">
          <p class="text-center text-white/60 text-xs">
            © 2025 SBS POS System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
// Page meta
definePageMeta({
  layout: false,
  auth: false,
});

// Reactive data
const form = reactive({
  identifier: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

// Import auth store
const authStore = useAuthStore();

// Actual login handler using Supabase
const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    // Basic validation
    if (!form.identifier || !form.password) {
      throw new Error("Semua field harus diisi");
    }

    // Check for basic format
    if (form.identifier.includes("@")) {
      // Email format
      if (!form.identifier.includes(".")) {
        throw new Error("Format email tidak valid");
      }
    } else {
      // User ID format (001-ADN)
      if (!/^\d{3}-[A-Z]{2,4}$/.test(form.identifier)) {
        throw new Error("Format ID tidak valid. Gunakan format: 001-ADN");
      }
    }

    // Authenticate with Supabase
    await authStore.signIn(form.identifier, form.password);

    // Redirect based on user role
    if (authStore.profile?.role === "admin") {
      await navigateTo("/admin");
    } else if (authStore.profile?.role === "kasir") {
      await navigateTo("/kasir");
    } else {
      await navigateTo("/dashboard");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = err.message || "Email/ID atau password salah";
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: Implement forgot password functionality
  alert("Fitur lupa password akan segera tersedia");
};

// Auto-focus on mount
onMounted(() => {
  const identifierInput = document.querySelector(
    'input[type="text"]'
  ) as HTMLInputElement;
  if (identifierInput) {
    identifierInput.focus();
  }
});
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glassmorphism enhancements */
.backdrop-blur-md {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Custom shadow */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Focus ring improvements */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}
</style>
