<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Directorio de Clientes</h1>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/customers/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Nuevo Cliente
        </NuxtLink>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="pending" class="text-center py-12 text-slate-500 font-medium">
      Cargando listado de clientes...
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">Ocurrio un error al cargar los clientes: {{ error.message }}</p>
      <button class="mt-2 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg" @click="refresh()">
        Reintentar
      </button>
    </div>

    <!-- Estado vacio -->
    <div v-else-if="!customerList.length" class="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
      No hay clientes registrados en la plataforma.
    </div>

    <!-- Tabla de registros -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Nombre</th>
              <th class="px-5 py-3">Correo Electronico</th>
              <th class="px-5 py-3">Telefono</th>
              <th class="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in customerList" :key="item.id" class="hover:bg-slate-50 transition">
              <td class="px-5 py-4 font-mono font-semibold text-slate-900">
                #{{ item.id }}
              </td>

              <td class="px-5 py-4 font-semibold text-slate-900">
                {{ item.name }}
              </td>

              <td class="px-5 py-4 text-slate-600">
                {{ item.email }}
              </td>

              <td class="px-5 py-4 text-slate-500">
                {{ item.phone || 'No especificado' }}
              </td>

              <!-- Acciones por fila -->
              <td class="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                <NuxtLink
                  :to="`/customers/${item.id}/edit`"
                  class="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded transition"
                >
                  Editar
                </NuxtLink>

                <button
                  type="button"
                  :disabled="deletingId === item.id"
                  class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="deleteCustomerItem(item.id)"
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
    import { customerService } from '~/services/customerService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Directorio de Clientes' })

    const service = customerService()

    const page = ref(1)
    const deletingId = ref(null)

    // Peticion autenticada reactiva a la paginación con useAsyncData
    const { data, pending, error, refresh } = await useAsyncData(
      'customers-list',
      () => service.getAll({ page: page.value }),
      {
        watch: [page]
      }
    )

    const customerList = computed(() => data.value?.data || [])
    const meta = computed(() => data.value?.meta || { current_page: 1, last_page: 1 })

    // Eliminar registro
    const deleteCustomerItem = async (id) => {
      if (!confirm('¿Deseas eliminar este cliente de forma permanente?')) return

      deletingId.value = id
      try {
        await service.delete(id)
        await refresh()
      } catch (err) {
        alert(err.message || 'No fue posible eliminar el cliente seleccionado.')
      } finally {
        deletingId.value = null
      }
    }
</script>