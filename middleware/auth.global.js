// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  // Permitir paso al login
  if (to.path === '/login') {
    return
  }

  const { isAuthenticated, user, fetchUser } = useAuth()

  // Si no hay token, enviar al login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Si el token existe pero el usuario no esta en memoria, redirigir 
  if (!user.value) {
    const currentUser = await fetchUser()
    if (!currentUser) {
      return navigateTo('/login')
    }
  }
})