export const bookingService = () => {
  const api = useApi()

  return {
    getAll: (params = {}) => api.get('/bookings', params),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (payload) => api.post('/bookings', payload),
    updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
    delete: (id) => api.delete(`/bookings/${id}`)
  }
}