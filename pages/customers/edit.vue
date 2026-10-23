<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div>
      <NuxtLink to="/customers" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver al Directorio de Clientes
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Editar Cliente</h1>
      <p class="text-sm text-slate-500">Actualiza los datos de contacto del cliente seleccionado.</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="loadingCustomer" class="text-center py-12 text-slate-500 font-medium">
      Cargando informacion del cliente...
    </div>

    <!-- Estado de error -->
    <div v-else-if="loadError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ loadError }}
    </div>

    <!-- Formulario con datos precargados -->
    <div v-else class="space-y-4">
      <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
        {{ generalError }}
      </div>

      <CustomerForm
        :initial-data="currentCustomer"
        :loading="saving"
        :errors="fieldErrors"
        submit-button-text="Actualizar Cliente"
        @submit="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup>
    import { customerService } from '~/services/customerService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Editar Cliente' })

    const route = useRoute()
    const router = useRouter()
    const service = customerService()

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    // Carga inicial del cliente con useAsyncData
    const {
      data: currentCustomerResponse,
      pending: loadingCustomer,
      error: loadErrorData
    } = await useAsyncData(
      `customer-${route.params.id}`,
      () => service.getById(route.params.id)
    )

    const currentCustomer = computed(() => currentCustomerResponse.value?.data || currentCustomerResponse.value || null)
    const loadError = computed(() => loadErrorData.value?.message || '')

    // Enviar actualización al backend 
    const handleUpdate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.update(route.params.id, formData)
        router.push('/customers')
      } catch (error) {
        if (error.errors) {
          fieldErrors.value = error.errors
        }
        generalError.value = error.message || 'Error al actualizar los datos del cliente.'
      } finally {
        saving.value = false
      }
    }
</script>