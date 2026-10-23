<template>
  <form class="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm" @submit.prevent="handleSubmit">
    <!-- Nombre del medio -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre del Espacio *</label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Ej. Valla Publicitaria Los Próceres"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.name ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.name" class="text-xs text-rose-600 mt-1">{{ errors.name[0] }}</p>
    </div>

    <!-- Tipo y estado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo de Soporte *</label>
        <select
          v-model="formData.type"
          class="w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.type ? 'border-rose-400' : 'border-slate-300'"
        >
          <option value="billboard">Valla (Billboard)</option>
          <option value="screen">Pantalla Digital (Screen)</option>
          <option value="mupi">MUPI</option>
          <option value="wall">Muro (Wall)</option>
        </select>
        <p v-if="errors.type" class="text-xs text-rose-600 mt-1">{{ errors.type[0] }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Estado *</label>
        <select
          v-model="formData.status"
          class="w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.status ? 'border-rose-400' : 'border-slate-300'"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <p v-if="errors.status" class="text-xs text-rose-600 mt-1">{{ errors.status[0] }}</p>
      </div>
    </div>

    <!-- Ubicacion -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Ubicación / Dirección *</label>
      <input
        v-model="formData.location"
        type="text"
        placeholder="Ej. Boulevard Monseñor Romero, Tramo Norte"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.location ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.location" class="text-xs text-rose-600 mt-1">{{ errors.location[0] }}</p>
    </div>

    <!-- Dimensiones y tarifa -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Dimensiones *</label>
        <input
          v-model="formData.dimensions"
          type="text"
          placeholder="Ej. 12x4m o 1920x1080px"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.dimensions ? 'border-rose-400' : 'border-slate-300'"
        />
        <p v-if="errors.dimensions" class="text-xs text-rose-600 mt-1">{{ errors.dimensions[0] }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Precio por Día ($ USD) *</label>
        <input
          v-model.number="formData.price_per_day"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.price_per_day ? 'border-rose-400' : 'border-slate-300'"
        />
        <p v-if="errors.price_per_day" class="text-xs text-rose-600 mt-1">{{ errors.price_per_day[0] }}</p>
      </div>
    </div>

    <!-- Botones de Accion -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <NuxtLink
        to="/"
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
      type: 'billboard',
      location: '',
      dimensions: '',
      price_per_day: '',
      status: 'active'
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
    default: 'Guardar Medio'
  }
})

const emit = defineEmits(['submit'])

// Copiar los datos iniciales
const formData = reactive({ ...props.initialData })

// Actualizar el formulario
watch(
  () => props.initialData,
  (newData) => {
    Object.assign(formData, newData)
  },
  { deep: true }
)

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>