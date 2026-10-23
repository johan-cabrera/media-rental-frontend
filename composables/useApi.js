// composables/useApi.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const request = async (endpoint, options = {}) => {
    // Leer la cookie al realizar la peticion
    const token = useCookie('auth_token')
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    // Definir encabezados base 
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }

    // Inyectar Authorization si existe el token
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    try {
      return await $fetch(url, {
        ...options,
        headers
      })
    } catch (error) {
      // Si la API responde 401, limpiar sesión y redirigir
      const status = error.response?.status || error.statusCode || error.status

      if (status === 401) {
        token.value = null
        const userState = useState('auth_user', () => null)
        userState.value = null
        await navigateTo('/login')
      }

      const backendError = error.data || {
        message: error.message || 'Error inesperado al conectar con el servidor.'
      }

      throw backendError
    }
  }

  return {
    get: (endpoint, query = {}) => request(endpoint, { method: 'GET', query }),
    post: (endpoint, body = {}) => request(endpoint, { method: 'POST', body }),
    put: (endpoint, body = {}) => request(endpoint, { method: 'PUT', body }),
    patch: (endpoint, body = {}) => request(endpoint, { method: 'PATCH', body }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' })
  }
}