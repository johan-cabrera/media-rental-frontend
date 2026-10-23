<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div>
      <NuxtLink to="/admin/users" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        ← Volver a Usuarios
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Nuevo Usuario</h1>
    </div>

    <!-- Alerta de error general -->
    <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ generalError }}
    </div>

    <!-- Formulario -->
    <UserForm
      :loading="saving"
      :errors="fieldErrors"
      submit-button-text="Crear Usuario"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
    import { adminUserService } from '~/services/adminUserService'

    definePageMeta({
      middleware: 'admin'
    })

    useHead({ title: 'Nuevo Usuario' })

    const router = useRouter()
    const service = adminUserService()

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    const handleCreate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.create(formData)
        router.push('/admin/users')
      } catch (error) {
        if (error.errors) {
          fieldErrors.value = error.errors
        }
        generalError.value = error.message || 'No fue posible registrar al usuario.'
      } finally {
        saving.value = false
      }
    }
</script>