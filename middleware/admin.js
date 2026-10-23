export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, user, isAdmin, fetchUser } = useAuth()

  // verificar autenticacion
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Cargar el usuario en memoria
  if (!user.value) {
    await fetchUser()
  }

  // Si no es admin, redirigir a la vista principal
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})