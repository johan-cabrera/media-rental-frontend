<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="sm:flex sm:items-center sm:justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Espacios Publicitarios</h1>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/media/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Nuevo Espacio
        </NuxtLink>
      </div>
    </div>

    <!-- Barra de filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Buscar</label>
        <input
          v-model="search"
          type="text"
          placeholder="Nombre o ubicacion..."
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Tipo de soporte</label>
        <select
          v-model="typeFilter"
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los tipos</option>
          <option value="billboard">Valla (Billboard)</option>
          <option value="screen">Pantalla Digital (Screen)</option>
          <option value="mupi">MUPI</option>
          <option value="wall">Muro (Wall)</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
        <select
          v-model="statusFilter"
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="pending" class="text-center py-12 text-slate-500 font-medium">
      Cargando inventario de medios...
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">Ocurrio un error al cargar los medios: {{ error.message }}</p>
      <button class="mt-2 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg" @click="refresh()">
        Reintentar
      </button>
    </div>

    <!-- Estado vacio -->
    <div v-else-if="!mediaList.length" class="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
      No se encontraron medios registrados con los criterios seleccionados.
    </div>

    <!-- Tabla de registros -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Nombre</th>
              <th class="px-5 py-3">Tipo</th>
              <th class="px-5 py-3">Ubicacion</th>
              <th class="px-5 py-3">Dimensiones</th>
              <th class="px-5 py-3">Precio / Dia</th>
              <th class="px-5 py-3">Estado</th>
              <th class="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in mediaList" :key="item.id" class="hover:bg-slate-50 transition">
              <!-- Columna ID alineada al estilo del sistema -->
              <td class="px-5 py-4 font-mono font-semibold text-slate-900">
                #{{ item.id }}
              </td>

              <td class="px-5 py-4 font-semibold text-slate-900">
                {{ item.name }}
              </td>

              <td class="px-5 py-4 capitalize">
                {{ item.type }}
              </td>

              <td class="px-5 py-4 max-w-xs truncate text-xs text-slate-500">
                {{ item.location }}
              </td>

              <td class="px-5 py-4 text-xs font-mono">
                {{ item.dimensions }}
              </td>

              <td class="px-5 py-4 font-bold text-slate-900">
                ${{ Number(item.price_per_day).toFixed(2) }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': item.status === 'active',
                    'bg-slate-100 text-slate-600 border border-slate-200': item.status === 'inactive'
                  }"
                >
                  {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones por fila -->
              <td class="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                <NuxtLink
                  :to="`/media/${item.id}`"
                  class="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition"
                >
                  Ver
                </NuxtLink>

                <NuxtLink
                  :to="`/media/${item.id}/edit`"
                  class="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded transition"
                >
                  Editar
                </NuxtLink>

                <button
                  type="button"
                  :disabled="deletingId === item.id"
                  class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="deleteMediaItem(item.id)"
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
    import { mediaService } from '~/services/mediaService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Espacios Publicitarios' })

    const service = mediaService()

    const page = ref(1)
    const search = ref('')
    const typeFilter = ref('')
    const statusFilter = ref('')
    const deletingId = ref(null)

    // Peticion conectada a useApi mediante el servicio
    const { data, pending, error, refresh } = await useAsyncData(
      'media-list',
      () => service.getAll({
        page: page.value,
        search: search.value || undefined,
        type: typeFilter.value || undefined,
        status: statusFilter.value || undefined
      }),
      {
        // ejecutar la consulta automaticamente 
        watch: [page, search, typeFilter, statusFilter]
      }
    )

    const mediaList = computed(() => data.value?.data || [])
    const meta = computed(() => data.value?.meta || { current_page: 1, last_page: 1 })

    // Resetear paginacion al cambiar filtros
    watch([search, typeFilter, statusFilter], () => {
      page.value = 1
    })

    // Eliminar registro
    const deleteMediaItem = async (id) => {
      if (!confirm('¿Deseas eliminar este espacio publicitario de forma permanente?')) return

      deletingId.value = id
      try {
        await service.delete(id)
        await refresh()
      } catch (err) {
        alert(err.message || 'No fue posible eliminar el registro.')
      } finally {
        deletingId.value = null
      }
    }
</script>