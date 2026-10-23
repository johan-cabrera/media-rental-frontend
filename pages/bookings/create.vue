<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <NuxtLink to="/bookings" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
        Volver a Reservas
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900 mt-2">Nueva Reserva</h1>
    </div>

    <div v-if="generalError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
      {{ generalError }}
    </div>

    <form class="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm" @submit.prevent="handleSubmit">
      
      <!-- Componente modular para cliente -->
      <CustomerSelect
        ref="customerSelectRef"
        v-model="form.customer_id"
        :customers="customers"
      />

      <!-- Espacio publicitario -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Espacio Publicitario *</label>
        <select
          v-model="form.media_id"
          class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="">Selecciona un espacio</option>
          <option v-for="m in mediaList" :key="m.id" :value="m.id">
            {{ m.name }} - ${{ Number(m.price_per_day).toFixed(2) }}/dia
          </option>
        </select>
      </div>

      <!-- Fechas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de Inicio *</label>
          <input
            v-model="form.start_date"
            type="date"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de Fin *</label>
          <input
            v-model="form.end_date"
            type="date"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      <!-- Total estimado -->
      <div v-if="totalDays > 0 && selectedMedia" class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between">
        <span class="text-slate-600">{{ totalDays }} dia(s) a ${{ Number(selectedMedia.price_per_day).toFixed(2) }}/dia</span>
        <span class="font-bold text-slate-900">Total: ${{ estimatedTotal.toFixed(2) }}</span>
      </div>

      <!-- Acciones -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <NuxtLink to="/bookings" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800">
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
        >
          {{ saving ? 'Guardando...' : 'Confirmar Reserva' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
    import { customerService } from '~/services/customerService'
    import { bookingService } from '~/services/bookingService'
    import { mediaService } from '~/services/mediaService'

    definePageMeta({
      middleware: 'auth'
    })

    useHead({ title: 'Nueva Reserva' })

    const router = useRouter()
    const customerSelectRef = ref(null)

    const saving = ref(false)
    const generalError = ref('')

    const form = reactive({
      customer_id: '',
      media_id: '',
      start_date: '',
      end_date: ''
    })

    // Cargar clientes y medios activos usando useAsyncData
    const { data: initialData } = await useAsyncData('new-booking-dependencies', async () => {
      const [cRes, mRes] = await Promise.all([
        customerService().getAll({ all: true }),
        mediaService().getAll({ status: 'active', all: true })
      ])

      return {
        customers: cRes.data || cRes || [],
        mediaList: mRes.data || mRes || []
      }
    })

    const customers = computed(() => initialData.value?.customers || [])
    const mediaList = computed(() => initialData.value?.mediaList || [])

    const selectedMedia = computed(() =>
      mediaList.value.find((m) => m.id === Number(form.media_id))
    )

    const totalDays = computed(() => {
      if (!form.start_date || !form.end_date) return 0
      const diff = (new Date(form.end_date) - new Date(form.start_date)) / (1000 * 60 * 60 * 24) + 1
      return diff > 0 ? Math.ceil(diff) : 0
    })

    const estimatedTotal = computed(() =>
      selectedMedia.value && totalDays.value > 0
        ? totalDays.value * Number(selectedMedia.value.price_per_day)
        : 0
    )

    const handleSubmit = async () => {
      saving.value = true
      generalError.value = ''

      try {
        // Obtener el id del cliente
        const customerId = await customerSelectRef.value.resolveCustomerId()
        if (!customerId) throw new Error('Debes seleccionar o crear un cliente.')

        // Creacion de la reserva
        await bookingService().create({
          customer_id: customerId,
          media_id: form.media_id,
          starts_at: form.start_date,
          ends_at: form.end_date
        })

        router.push('/bookings')
      } catch (err) {
        generalError.value = err.message || 'Error al procesar la reserva.'
      } finally {
        saving.value = false
      }
    }
</script>