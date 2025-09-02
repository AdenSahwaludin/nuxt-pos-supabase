export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Check if user has required role
  const requiredRole = to.meta?.role;

  if (requiredRole && authStore.profile?.role !== requiredRole) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }
});
