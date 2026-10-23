<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado -->
    <div>
      <NuxtLink to="/" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver al Catálogo
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Nuevo Espacio Publicitario</h1>
    </div>

    <!-- Alerta de error general -->
    <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ generalError }}
    </div>

    <!-- Formulario -->
    <MediaForm
      :loading="saving"
      :errors="fieldErrors"
      submit-button-text="Crear Espacio Publicitario"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
    import { mediaService } from '~/services/mediaService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Nuevo Espacio Publicitario' })

    const router = useRouter()
    const service = mediaService()

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    const handleCreate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.create(formData)
        router.push('/')
      } catch (error) {
        if (error.errors) {
          fieldErrors.value = error.errors
        }
        generalError.value = error.message || 'No fue posible registrar el espacio publicitario.'
      } finally {
        saving.value = false
      }
    }
</script>