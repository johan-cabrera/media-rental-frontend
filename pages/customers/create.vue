<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div>
      <NuxtLink to="/customers" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver al Directorio de Clientes
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Nuevo Cliente</h1>
    </div>

    <!-- Alerta de error general -->
    <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ generalError }}
    </div>

    <!-- Formulario -->
    <CustomerForm
      :loading="saving"
      :errors="fieldErrors"
      submit-button-text="Registrar Cliente"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
    import { customerService } from '~/services/customerService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Nuevo Cliente' })

    const router = useRouter()
    const service = customerService()

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    const handleCreate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.create(formData)
        router.push('/customers')
      } catch (error) {
        if (error.errors) {
          fieldErrors.value = error.errors
        }
        generalError.value = error.message || 'No fue posible registrar al cliente.'
      } finally {
        saving.value = false
      }
    }
</script>