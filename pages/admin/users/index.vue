<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="sm:flex sm:items-center sm:justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Usuarios del Sistema</h1>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/users/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Nuevo Usuario
        </NuxtLink>
      </div>
    </div>

    <!-- filtros -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Buscar</label>
        <input
          v-model="search"
          type="text"
          placeholder="Nombre o correo..."
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1">Rol de Usuario</label>
        <select
          v-model="roleFilter"
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="pending" class="text-center py-12 text-slate-500 font-medium">
      Cargando usuarios...
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">Ocurrió un error al cargar los usuarios: {{ error.message }}</p>
      <button class="mt-2 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg" @click="refresh()">
        Reintentar
      </button>
    </div>

    <!-- Estado vacio -->
    <div v-else-if="!userList.length" class="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
      No se encontraron usuarios registrados con los criterios seleccionados.
    </div>

    <!-- Tabla de registros -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Nombre</th>
              <th class="px-5 py-3">Correo</th>
              <th class="px-5 py-3">Rol</th>
              <th class="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="userItem in userList" :key="userItem.id" class="hover:bg-slate-50 transition">
              <td class="px-5 py-4 font-mono font-semibold text-slate-900">
                #{{ userItem.id }}
              </td>

              <td class="px-5 py-4 font-semibold text-slate-900">
                {{ userItem.name }}
              </td>

              <td class="px-5 py-4 text-slate-500">
                {{ userItem.email }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                  :class="{
                    'bg-purple-50 text-purple-700 border border-purple-200': userItem.role === 'admin',
                    'bg-slate-100 text-slate-600 border border-slate-200': userItem.role === 'user'
                  }"
                >
                  {{ userItem.role === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </td>

              <!-- Acciones por fila -->
              <td class="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/users/edit?id=${userItem.id}`"
                  class="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded transition"
                >
                  Editar
                </NuxtLink>

                <button
                  type="button"
                  :disabled="deletingId === userItem.id"
                  class="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition disabled:opacity-50"
                  @click="deleteUserItem(userItem.id)"
                >
                  {{ deletingId === userItem.id ? 'Borrando...' : 'Eliminar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginacion -->
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-200 text-sm">
        <span class="text-slate-500">Página {{ meta.current_page }} de {{ meta.last_page }}</span>
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
    import { adminUserService } from '~/services/adminUserService'

    definePageMeta({
      middleware: 'admin'
    })

    useHead({ title: 'Usuarios del Sistema' })

    const service = adminUserService()

    const page = ref(1)
    const search = ref('')
    const roleFilter = ref('')
    const deletingId = ref(null)

    const { data, pending, error, refresh } = await useAsyncData(
      'admin-users-list',
      () => service.getAll({
        page: page.value,
        search: search.value || undefined,
        role: roleFilter.value || undefined
      }),
      {
        watch: [page, search, roleFilter]
      }
    )

    const userList = computed(() => data.value?.data || [])
    const meta = computed(() => data.value?.meta || { current_page: 1, last_page: 1 })

    watch([search, roleFilter], () => {
      page.value = 1
    })

    const deleteUserItem = async (id) => {
      if (!confirm('¿Deseas eliminar este usuario de forma permanente?')) return

      deletingId.value = id
      try {
        await service.delete(id)
        await refresh()
      } catch (err) {
        alert(err.message || 'No fue posible eliminar al usuario.')
      } finally {
        deletingId.value = null
      }
    }
</script>