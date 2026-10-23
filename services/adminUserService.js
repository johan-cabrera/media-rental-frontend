export const adminUserService = () => {
  const api = useApi()

  return {
    getAll: (params = {}) => api.get('/admin/users', params),
    getById: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    delete: (id) => api.delete(`/admin/users/${id}`)
  }
}