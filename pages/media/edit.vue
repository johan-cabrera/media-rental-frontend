<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <NuxtLink :to="`/media/${route.params.id}`" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver al Detalle
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Editar Espacio Publicitario</h1>
      <p class="text-sm text-slate-500">Actualiza las especificaciones o tarifas de este medio.</p>
    </div>

    <div v-if="loadingMedia" class="text-center py-12 text-slate-500 font-medium">
      Cargando información del espacio publicitario...
    </div>

    <div v-else-if="loadError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ loadError }}
    </div>

    <div v-else class="space-y-4">
      <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
        {{ generalError }}
      </div>

      <MediaForm
        :initial-data="currentMedia"
        :loading="saving"
        :errors="fieldErrors"
        submit-button-text="Actualizar Espacio Publicitario"
        @submit="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup>
    import { mediaService } from '~/services/mediaService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Editar Espacio Publicitario' })

    const route = useRoute()
    const router = useRouter()
    const service = mediaService()

    const saving = ref(false)
    const generalError = ref('')
    const fieldErrors = ref({})

    // Carga inicial del registro 
    const {
      data: currentMediaResponse,
      pending: loadingMedia,
      error: loadErrorData
    } = await useAsyncData(`media-${route.params.id}`, () => service.getById(route.params.id))

    const currentMedia = computed(() => currentMediaResponse.value?.data || currentMediaResponse.value || null)
    const loadError = computed(() => loadErrorData.value?.message || '')

    const handleUpdate = async (formData) => {
      saving.value = true
      generalError.value = ''
      fieldErrors.value = {}

      try {
        await service.update(route.params.id, formData)
        router.push('/')
      } catch (error) {
        if (error.errors) {
          fieldErrors.value = error.errors
        }
        generalError.value = error.message || 'Error al actualizar el espacio publicitario.'
      } finally {
        saving.value = false
      }
    }
</script>