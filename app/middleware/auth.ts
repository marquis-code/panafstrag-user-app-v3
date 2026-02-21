export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn.value && to.path.startsWith('/admin')) {
    return navigateTo('/login');
  }
});
