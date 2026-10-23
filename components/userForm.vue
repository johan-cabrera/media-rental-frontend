<template>
  <form class="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm" @submit.prevent="handleSubmit">
    <!-- Nombre Completo -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Ej. Juan Pérez"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        :class="errors.name ? 'border-rose-400' : 'border-slate-300'"
      />
      <p v-if="errors.name" class="text-xs text-rose-600 mt-1">{{ errors.name[0] }}</p>
    </div>

    <!-- Correo y Rol -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="usuario@mediarental.com"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.email ? 'border-rose-400' : 'border-slate-300'"
        />
        <p v-if="errors.email" class="text-xs text-rose-600 mt-1">{{ errors.email[0] }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Rol en el Sistema *</label>
        <select
          v-model="formData.role"
          class="w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          :class="errors.role ? 'border-rose-400' : 'border-slate-300'"
        >
          <option value="user">Usuario (Operador)</option>
          <option value="admin">Administrador</option>
        </select>
        <p v-if="errors.role" class="text-xs text-rose-600 mt-1">{{ errors.role[0] }}</p>
      </div>
    </div>

    <!-- Contraseñas -->
    <div>
      <p v-if="isEditing" class="text-xs text-slate-500 mb-2">
        Deja la contraseña en blanco si deseas conservarla.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            {{ isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña *' }}
          </label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            :class="errors.password ? 'border-rose-400' : 'border-slate-300'"
          />
          <p v-if="errors.password" class="text-xs text-rose-600 mt-1">{{ errors.password[0] }}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Confirmar Contraseña</label>
          <input
            v-model="formData.password_confirmation"
            type="password"
            placeholder="••••••••"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Botones de accion -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
      <NuxtLink
        to="/admin/users"
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
        default: () => ({})
      },
      loading: {
        type: Boolean,
        default: false
      },
      errors: {
        type: Object,
        default: () => ({})
      },
      submitButtonText: {
        type: String,
        default: 'Guardar Usuario'
      }
    })

    const emit = defineEmits(['submit'])

    const isEditing = computed(() => Boolean(props.initialData?.id))

    const formData = reactive({
      name: '',
      email: '',
      role: 'user',
      password: '',
      password_confirmation: ''
    })

    watch(
      () => props.initialData,
      (data) => {
        if (data && Object.keys(data).length > 0) {
          formData.name = data.name || ''
          formData.email = data.email || ''
          formData.role = data.role || 'user'
          formData.password = ''
          formData.password_confirmation = ''
        }
      },
      { immediate: true }
    )

    const handleSubmit = () => {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }

      if (formData.password) {
        payload.password = formData.password
        payload.password_confirmation = formData.password_confirmation
      }

      emit('submit', payload)
    }
</script>