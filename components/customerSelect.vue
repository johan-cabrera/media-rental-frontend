<template>
  <div class="space-y-3 pb-4 border-b border-slate-100">
    <div class="flex items-center justify-between">
      <label class="text-xs font-semibold text-slate-700">Cliente *</label>
      <button
        type="button"
        class="text-xs text-slate-500 hover:text-slate-900 underline"
        @click="toggleMode"
      >
        {{ isNew ? 'Seleccionar existente' : '+ Crear nuevo cliente' }}
      </button>
    </div>

    <!-- Select para cliente existente -->
    <div v-if="!isNew">
      <select
        :value="modelValue"
        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="">Selecciona un cliente</option>
        <option v-for="c in customers" :key="c.id" :value="c.id">
          {{ c.name }} ({{ c.email }})
        </option>
      </select>
    </div>

    <!-- Creacion rapida de cliente -->
    <div v-else class="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
      <input
        v-model="newCustomer.name"
        type="text"
        placeholder="Nombre completo *"
        class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          v-model="newCustomer.email"
          type="email"
          placeholder="Correo electronico *"
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        />
        <input
          v-model="newCustomer.phone"
          type="text"
          placeholder="Telefono (opcional)"
          class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { customerService } from '~/services/customerService'

const props = defineProps({
  modelValue: [String, Number],
  customers: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])
const isNew = ref(false)

const newCustomer = reactive({
  name: '',
  email: '',
  phone: ''
})

const toggleMode = () => {
  isNew.value = !isNew.value
  emit('update:modelValue', '')
}

// Funcion para que el padre pueda guardar el cliente
const resolveCustomerId = async () => {
  if (!isNew.value) return props.modelValue

  if (!newCustomer.name || !newCustomer.email) {
    throw new Error('Completa el nombre y correo del nuevo cliente.')
  }

  const res = await customerService().create(newCustomer)
  const created = res.data || res
  return created.id
}

defineExpose({ resolveCustomerId })
</script>