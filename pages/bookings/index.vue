<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="sm:flex sm:items-center sm:justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gestion de Reservas</h1>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-4">

        <NuxtLink
          to="/bookings/calendar"
          class="inline-flex items-center px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Ver Calendario
        </NuxtLink>

        <button
          type="button"
          :disabled="exporting"
          class="inline-flex items-center px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          @click="handleDownloadExport"
        >
          <span v-if="exporting">Descargando...</span>
          <span v-else>Exportar CSV</span>
        </button>

        <NuxtLink
          to="/bookings/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Nueva Reserva
        </NuxtLink>
      </div>
    </div>

    <!-- Barra de filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 max-w-xs">
      <label class="block text-xs font-semibold text-slate-600 mb-1">Filtrar por Estado</label>
      <select
        v-model="statusFilter"
        class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="confirmed">Confirmada</option>
        <option value="cancelled">Cancelada</option>
      </select>
    </div>

    <!-- Estado de carga -->
    <div v-if="pending" class="text-center py-12 text-slate-500 font-medium">
      Cargando listado de reservas...
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">Ocurrio un error al cargar las reservas: {{ error.message }}</p>
      <button class="mt-2 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg" @click="refresh()">
        Reintentar
      </button>
    </div>

    <!-- Estado vacio -->
    <div v-else-if="!bookingList.length" class="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
      No se encontraron reservas registradas con los filtros seleccionados.
    </div>

    <!-- Tabla de registros -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Cliente</th>
              <th class="px-5 py-3">Espacio Publicitario</th>
              <th class="px-5 py-3">Periodo</th>
              <th class="px-5 py-3">Total</th>
              <th class="px-5 py-3">Estado</th>
              <th class="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in bookingList" :key="item.id" class="hover:bg-slate-50 transition">
              <td class="px-5 py-4 font-mono font-semibold text-slate-900">
                #{{ item.id }}
              </td>

              <td class="px-5 py-4 font-medium text-slate-900">
                {{ item.customer?.name || 'Cliente #' + item.customer_id }}
              </td>

              <td class="px-5 py-4 text-slate-700">
                {{ item.media?.name || 'Medio #' + item.media_id }}
              </td>

              <td class="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                {{ item.starts_at }} al {{ item.ends_at }}
              </td>

              <td class="px-5 py-4 font-bold text-slate-900">
                ${{ Number(item.total_price || 0).toFixed(2) }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                  :class="{
                    'bg-amber-50 text-amber-700 border border-amber-200': item.status === 'pending',
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': item.status === 'confirmed',
                    'bg-rose-50 text-rose-700 border border-rose-200': item.status === 'cancelled'
                  }"
                >
                  {{ item.status === 'pending' ? 'Pendiente' : item.status === 'confirmed' ? 'Confirmada' : 'Cancelada' }}
                </span>
              </td>

              <!-- Acciones por fila -->
              <td class="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                <button
                  v-if="item.status === 'pending'"
                  type="button"
                  :disabled="updatingId === item.id"
                  class="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="updateBookingStatus(item.id, 'confirmed')"
                >
                  Confirmar
                </button>

                <button
                  v-if="item.status === 'pending'"
                  type="button"
                  :disabled="updatingId === item.id"
                  class="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="updateBookingStatus(item.id, 'cancelled')"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  :disabled="deletingId === item.id"
                  class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="deleteBookingItem(item.id)"
                >
                  {{ deletingId === item.id ? 'Borrando...' : 'Eliminar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginacion -->
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-200 text-sm">
        <span class="text-slate-500">Pagina {{ meta.current_page }} de {{ meta.last_page }}</span>
        <div class="flex gap-2">
          <button
            :disabled="page <= 1"
            class="px-3 py-1 border rounded bg-white disabled:opacity-40"
            @click="page--"
          >
            Anterior
          </button>
          <button
            :disabled="page >= meta.last_page"
            class="px-3 py-1 border rounded bg-white disabled:opacity-40"
            @click="page++"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { bookingService } from '~/services/bookingService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Gestion de Reservas' })

    const service = bookingService()

    const page = ref(1)
    const statusFilter = ref('')
    const deletingId = ref(null)
    const updatingId = ref(null)
    const exporting = ref(false)

    // Peticion conectada a useApi mediante el servicio y useAsyncData
    const { data, pending, error, refresh } = await useAsyncData(
      'bookings-list',
      () => service.getAll({
        page: page.value,
        status: statusFilter.value || undefined
      }),
      {
        watch: [page, statusFilter]
      }
    )

    const bookingList = computed(() => data.value?.data || [])
    const meta = computed(() => data.value?.meta || { current_page: 1, last_page: 1 })

    // Resetear paginacion al cambiar el filtro de estado
    watch(statusFilter, () => {
      page.value = 1
    })

    // Exportacion de csv
    const handleDownloadExport = async () => {
      exporting.value = true

      try {
        // autenticar la peticion
        const blobData = await service.downloadExport({
          status: statusFilter.value || undefined
        })

        // Crear un objeto URL en memoria
        const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)

        // Crear enlace temporal y simular click
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `reservas_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()

        //Limpiar del DOM y memoria
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        alert(err.message || 'Error al descargar el archivo de reservas.')
      } finally {
        exporting.value = false
      }
    }

    // Cambio rapido de estado
    const updateBookingStatus = async (id, newStatus) => {
      updatingId.value = id
      try {
        await service.updateStatus(id, newStatus)
        await refresh()
      } catch (err) {
        alert(err.message || 'No fue posible actualizar el estado de la reserva.')
      } finally {
        updatingId.value = null
      }
    }

    // Eliminar registro
    const deleteBookingItem = async (id) => {
      if (!confirm('¿Deseas eliminar esta reserva de forma permanente?')) return

      deletingId.value = id
      try {
        await service.delete(id)
        await refresh()
      } catch (err) {
        alert(err.message || 'No fue posible eliminar la reserva.')
      } finally {
        deletingId.value = null
      }
    }
</script>