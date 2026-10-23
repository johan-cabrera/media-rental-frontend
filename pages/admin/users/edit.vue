<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div>
      <NuxtLink to="/admin/users" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        ← Volver a Usuarios
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Editar Usuario</h1>
    </div>

    <!-- Alerta de error general -->
    <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ generalError }}
    </div>

    <!-- Estado de carga -->
    <div v-if="pending" class="text-center py-12 text-slate-500 font-medium">
      Cargando información del usuario...
    </div>

    <!-- Error al obtener los datos iniciales -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center">
      <p class="text-sm font-medium">No fue posible cargar el usuario: {{ error.message }}</p>
      <NuxtLink to="/admin/users" class="mt-2 inline-block text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg">
        Regresar al listado
      </NuxtLink>
    </div>

    <!-- Formulario -->
    <UserForm
      v-else
      :initial-data="userData"
      :loading="saving"
      :errors="fieldErrors"
      submit-button-text="Actualizar Usuario"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
    import { adminUserService } from '~/services/adminUserService'

    definePageMeta({
      middleware: 'admin'
    })

    useHead({ title: 'Editar Usuario' })

    const route = useRoute()
    const router = useRouter()
    const service = adminUserService()

    const userId = route.query.id

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    // Cargar informacion del usuario
    const { data, pending, error } = await useAsyncData(
      `admin-user-${userId}`,
      () => service.getById(userId)
    )

    const userData = computed(() => data.value?.data || data.value || {})

    const handleUpdate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.update(userId, formData)
        router.push('/admin/users')
      } catch (err) {
        if (err.errors) {
          fieldErrors.value = err.errors
        }
        generalError.value = err.message || 'No fue posible actualizar al usuario.'
      } finally {
        saving.value = false
      }
    }
</script>