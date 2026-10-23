<template>
  <form class="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm" @submit.prevent="handleSubmit">
    <!-- Nombre Completo -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Ej. Roberto Hernandez"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.name ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.name" class="text-xs text-rose-600 mt-1">{{ errors.name[0] }}</p>
    </div>

    <!-- Correo Electronico -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Correo Electronico *</label>
      <input
        v-model="formData.email"
        type="email"
        placeholder="ejemplo@empresa.com"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.email ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.email" class="text-xs text-rose-600 mt-1">{{ errors.email[0] }}</p>
    </div>

    <!-- Telefono -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Telefono (Opcional)</label>
      <input
        v-model="formData.phone"
        type="text"
        placeholder="Ej. +503 7000-0000"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.phone ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.phone" class="text-xs text-rose-600 mt-1">{{ errors.phone[0] }}</p>
    </div>

    <!-- Botones de accion -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <NuxtLink
        to="/customers"
        class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
      >
        Cancelar
      </NuxtLink>
      <button
        type="submit"
        :disabled="loading"
        class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
      >
        {{ loading ? 'Guardando...' : submitButtonText }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: ''
    })
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    default: 'Guardar Cliente'
  }
})

const emit = defineEmits(['submit'])

const formData = reactive({
  name: props.initialData.name || '',
  email: props.initialData.email || '',
  phone: props.initialData.phone || ''
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.name = newData.name || ''
      formData.email = newData.email || ''
      formData.phone = newData.phone || ''
    }
  },
  { deep: true }
)

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>