<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- Barra de Navegación -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
              <span class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <span>Publimovil <span class="text-slate-500 font-normal text-sm">Media Rental</span></span>
            </NuxtLink>
          </div>

          <!-- Navegacion -->
          <nav class="flex items-center gap-2">
            <NuxtLink 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              Espacios publicitarios
            </NuxtLink>

            <NuxtLink 
              to="/bookings" 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path.startsWith('/bookings') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              Reservas
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenido dinamico de la pagina -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!--pie de pagina -->
    <footer class="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        Publimovil Media Rental &copy; Sistema de Gestión y Reservas
      </div>
    </footer>
  </div>
</template>

<script setup>
// En Vue 3 con Nuxt 3, $route está disponible globalmente en la plantilla.
// No requerimos lógica adicional aquí por el momento.
</script>