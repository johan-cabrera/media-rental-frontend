export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()

  // despues de iniciar sesion, redirigir a la vista principal
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})