export const customerService = () => {
  const api = useApi()

  return {
    getAll: (params = {}) => api.get('/customers', params),
    getById: (id) => api.get(`/customers/${id}`),
    create: (payload) => api.post('/customers', payload),
    update: (id, payload) => api.put(`/customers/${id}`, payload),
    delete: (id) => api.delete(`/customers/${id}`)
  }
}