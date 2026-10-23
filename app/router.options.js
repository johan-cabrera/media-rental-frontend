export default {
  routes: (_routes) => [
    {
      path: '/login',
      component: () => import('~/pages/login.vue')
    },
    // Modulo de usuarios
    {
      name: 'admin-users',
      path: '/admin/users',
      component: () => import('~/pages/admin/users/index.vue')
    },
    {
      name: 'admin-users-create',
      path: '/admin/users/create',
      component: () => import('~/pages/admin/users/create.vue')
    },
    {
      name: 'admin-users-edit',
      path: '/admin/users/edit',
      component: () => import('~/pages/admin/users/edit.vue')
    },
    {
      // La ruta por defecto es medios
      // Modulo de medios
      name: 'media-index',
      path: '/',
      component: () => import('~/pages/media/index.vue')
    },
    {
      name: 'media-create',
      path: '/media/create',
      component: () => import('~/pages/media/create.vue')
    },
    {
      name: 'media-detail',
      path: '/media/:id',
      component: () => import('~/pages/media/detail.vue')
    },
    {
      name: 'media-edit',
      path: '/media/:id/edit',
      component: () => import('~/pages/media/edit.vue')
    },

    // Modulo de clientes
    {
      name: 'customers-index',
      path: '/customers',
      component: () => import('~/pages/customers/index.vue')
    },
    {
      name: 'customers-create',
      path: '/customers/create',
      component: () => import('~/pages/customers/create.vue')
    },
    {
      name: 'customers-edit',
      path: '/customers/:id/edit',
      component: () => import('~/pages/customers/edit.vue')
    },

    // Modulo de reservas
    {
      name: 'bookings-index',
      path: '/bookings',
      component: () => import('~/pages/bookings/index.vue')
    },
    {
      name: 'bookings-create',
      path: '/bookings/create',
      component: () => import('~/pages/bookings/create.vue')
    }
  ]
}