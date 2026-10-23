export const mediaService = () => {
  const api = useApi()

  return {
    getAll: (params = {}) => api.get('/media', params),
    getById: (id) => api.get(`/media/${id}`),
    create: (payload) => api.post('/media', payload),
    update: (id, payload) => api.put(`/media/${id}`, payload),
    delete: (id) => api.delete(`/media/${id}`),
    checkAvailability: (id, startsAt, endsAt) => {
      return api.get(`/media/${id}/availability`, {
        starts_at: startsAt,
        ends_at: endsAt
      })
    }
  }
}