<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div>
      <NuxtLink to="/" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver al Catálogo
      </NuxtLink>
    </div>

    <!-- Carga del detalle -->
    <div v-if="pending" class="text-center py-12 text-slate-500">
      Cargando información del espacio publicitario...
    </div>

    <!-- Error de carga -->
    <div v-else-if="error || !media" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">No se encontró el espacio publicitario solicitado.</p>
      <NuxtLink to="/" class="mt-2 inline-block text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg">
        Regresar al inicio
      </NuxtLink>
    </div>

    <!-- Contenido principal -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Informacion del medio -->
      <div class="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 uppercase">
            {{ media.type }}
          </span>
          <span 
            class="text-xs font-semibold px-2.5 py-1 rounded"
            :class="media.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
          >
            {{ media.status === 'active' ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ media.name }}</h1>
          <p class="text-sm text-slate-500 mt-1">Ubicación: {{ media.location }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div>
            <span class="text-slate-400 block text-xs">Dimensiones</span>
            <span class="font-medium text-slate-800">{{ media.dimensions || 'No especificadas' }}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-xs">Tarifa Diaria</span>
            <span class="text-lg font-bold text-indigo-600">${{ Number(media.price_per_day).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Verificador de disponibilidad -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 class="text-base font-bold text-slate-900">Consultar Disponibilidad</h2>

        <form class="space-y-3" @submit.prevent="checkAvailability">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Fecha de Inicio</label>
            <input 
              v-model="dates.starts_at" 
              type="date" 
              required
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Fecha de Fin</label>
            <input 
              v-model="dates.ends_at" 
              type="date" 
              required
              :min="dates.starts_at"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="checking"
            class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
          >
            {{ checking ? 'Consultando...' : 'Verificar Fechas' }}
          </button>
        </form>

        <!-- Resultado de la consulta -->
        <div v-if="availabilityResult" class="p-4 rounded-lg text-sm border" :class="availabilityResult.available ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'">
          <div class="font-semibold">
            {{ availabilityResult.available ? 'Espacio Disponible' : 'No Disponible' }}
          </div>
          
          <div v-if="availabilityResult.available" class="mt-2 text-xs space-y-1">
            <p>Días a reservar: <span class="font-semibold">{{ availabilityResult.total_days }}</span></p>
            <p>Total estimado: <span class="font-semibold">${{ Number(availabilityResult.estimated_price).toFixed(2) }}</span></p>
            
            <NuxtLink
              :to="`/bookings/create?media_id=${media.id}&starts_at=${dates.starts_at}&ends_at=${dates.ends_at}`"
              class="mt-3 block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 rounded transition text-xs"
            >
              Reservar este medio
            </NuxtLink>
          </div>
          <div v-else class="mt-1 text-xs text-rose-700">
            Ya existe una reserva confirmada en este rango de fechas.
          </div>
        </div>

        <div v-if="availabilityError" class="text-xs text-red-600 bg-red-50 p-2 rounded">
          {{ availabilityError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    definePageMeta({
      middleware: 'auth'
    })

    const route = useRoute()
    const api = useApi()

    // Consulta protegida con useAsyncData 
    const { data, pending, error } = await useAsyncData(
      `media-detail-${route.params.id}`,
      () => api.get(`/media/${route.params.id}`)
    )

    const media = computed(() => data.value?.data || data.value || null)

    useHead({
      title: computed(() => (media.value ? media.value.name : 'Detalle de Medio'))
    })

    // Estados para el verificador de fechas
    const dates = reactive({
      starts_at: '',
      ends_at: ''
    })

    const checking = ref(false)
    const availabilityResult = ref(null)
    const availabilityError = ref('')

    const checkAvailability = async () => {
      if (!dates.starts_at || !dates.ends_at) return

      checking.value = true
      availabilityResult.value = null
      availabilityError.value = ''

      try {
        const response = await api.get(`/media/${route.params.id}/availability`, {
          starts_at: dates.starts_at,
          ends_at: dates.ends_at
        })
        availabilityResult.value = response
      } catch (err) {
        availabilityError.value = err.message || 'Error al comprobar disponibilidad.'
      } finally {
        checking.value = false
      }
    }
</script>