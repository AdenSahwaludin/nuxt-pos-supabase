// Auto-imported Nuxt Composables and Helpers
// Suppress VSCode TS errors for auto-imports

declare function defineNuxtRouteMiddleware(fn: (to: any) => any): any;
declare function navigateTo(path: string): any;
declare function useAuthStore(): any;
// Nuxt auto-import define plugin helper
declare function defineNuxtPlugin(fn: any): any;
// Nuxt 4 auto-import helpers
declare function definePageMeta(meta: any): void;
// Vue 3 auto-imported reactivity APIs
declare function reactive<T>(value: T): T;
declare function ref<T>(value: T): { value: T };
declare function computed<T>(value: T): { value: T };
declare function onMounted(fn: () => void): void;
declare function watch<T>(
  source: T,
  callback: (newVal: T, oldVal: T) => void
): void;
// VueUse composables
declare function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  ms?: number
): T;
declare function useRuntimeConfig<T = any>(): T;
