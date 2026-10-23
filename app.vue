<template>
  <div class="min-h-screen bg-slate-50 flex flex-col text-slate-800">
    <header v-if="isAuthenticated" class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="font-bold text-slate-900 tracking-tight text-sm">
            MediaRental
          </NuxtLink>

          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-xs font-medium transition py-4 border-b-2"
              :class="route.path === '/' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-900'"
            >
              Espacios
            </NuxtLink>

            <NuxtLink
              to="/customers"
              class="text-xs font-medium transition py-4 border-b-2"
              :class="route.path.startsWith('/customers') ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-900'"
            >
              Clientes
            </NuxtLink>

            <NuxtLink
              to="/bookings"
              class="text-xs font-medium transition py-4 border-b-2"
              :class="route.path.startsWith('/bookings') ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-900'"
            >
              Reservas
            </NuxtLink>

            <!-- Navegacion para admins -->
            <NuxtLink
              v-if="isAdmin"
              to="/admin/users"
              class="text-xs font-medium transition py-4 border-b-2"
              :class="route.path.startsWith('/admin/users') ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-900'"
            >
              Usuarios
            </NuxtLink>
          </nav>
        </div>

        <!-- Perfil y logout -->
        <div class="flex items-center gap-4 text-xs">
          <span class="text-slate-500">
            {{ user?.name }}
            <span class="text-[10px] uppercase font-bold text-slate-400 ml-1">({{ user?.role }})</span>
          </span>

          <button
            type="button"
            class="text-rose-600 hover:text-rose-800 font-semibold transition"
            @click="logout"
          >
            Salir
          </button>
        </div>

      </div>
    </header>

    <!-- Contenido principal -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
    const route = useRoute()
    const { isAuthenticated, user, isAdmin, logout } = useAuth()
</script>