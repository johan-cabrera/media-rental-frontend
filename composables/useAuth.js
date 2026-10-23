export const useAuth = () => {
  const api = useApi()

  // Token persistido en cookie
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 dias de duración
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  // Estado global para el usuario autenticado
  const user = useState('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Obtener datos del usuario actual
  const fetchUser = async () => {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      const response = await api.get('/me')
      user.value = response.user
      return response.user
    } catch (error) {
      token.value = null
      user.value = null
      return null
    }
  }

  // Iniciar sesion
  const login = async (credentials) => {
    const response = await api.post('/login', credentials)
    
    // Guardar token y usuario retornados por el backend
    token.value = response.token
    user.value = response.user

    return response
  }

  // Cerrar sesion
  const logout = async () => {
    try {
      if (token.value) {
        await api.post('/logout')
      }
    } catch (error) {
      // Si la API falla o el token expira, continuar y limpiar todo
    } finally {
      token.value = null
      user.value = null
      navigateTo('/login')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser
  }
}