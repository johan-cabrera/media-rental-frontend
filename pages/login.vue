<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Encabezado -->
      <div class="text-center">
        <h1 class="text-xl font-bold tracking-tight text-slate-900">
          Media Rental
        </h1>
        <p class="mt-1 text-xs text-slate-500">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 border border-slate-200 rounded-xl shadow-sm sm:px-8">
        
        <!-- Mensaje de error general -->
        <div
          v-if="generalError"
          class="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs"
        >
          {{ generalError }}
        </div>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="correo@dominio.com"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-900"
              :class="errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'"
            />
            <p v-if="errors.email" class="text-xs text-rose-600 mt-1">
              {{ errors.email[0] }}
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="Su contraseña"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-900"
              :class="errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'"
            />
            <p v-if="errors.password" class="text-xs text-rose-600 mt-1">
              {{ errors.password[0] }}
            </p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-2 px-4 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {{ loading ? 'Iniciando sesión...' : 'Ingresar' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

useHead({
  title: 'Iniciar Sesión'
})

const { login } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const generalError = ref('')
const errors = ref({})

const handleLogin = async () => {
  loading.value = true
  generalError.value = ''
  errors.value = {}

  try {
    await login(form)
    router.push('/')
  } catch (err) {
    if (err.errors) {
      errors.value = err.errors
    }
    generalError.value = err.message || 'Error al conectar con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>