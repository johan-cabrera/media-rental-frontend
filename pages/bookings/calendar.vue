<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="sm:flex sm:items-center sm:justify-between pb-4 border-b border-slate-200">
      <div>
        <NuxtLink to="/bookings" class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
          Volver a Reservas
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Calendario de Ocupación
        </h1>
      </div>

      <div class="mt-4 sm:mt-0 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmada</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pendiente</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cancelada</span>
      </div>
    </div>

    <!-- Calendario -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <ClientOnly>
        <FullCalendar :options="calendarOptions" />
      </ClientOnly>
    </div>

    <!-- Detalle de reserva -->
    <div
      v-if="selectedBooking"
      class="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4"
      @click.self="selectedBooking = null"
    >
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-3 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 font-bold text-sm">
          <span>Reserva #{{ selectedBooking.id }}</span>
          <button class="text-slate-400 hover:text-slate-600 text-lg leading-none" @click="selectedBooking = null">×</button>
        </div>

        <div class="space-y-1.5">
          <p><strong class="text-slate-700">Espacio:</strong> {{ selectedBooking.media?.name }}</p>
          <p><strong class="text-slate-700">Cliente:</strong> {{ selectedBooking.customer?.name }}</p>
          <p><strong class="text-slate-700">Período:</strong> {{ selectedBooking.starts_at }} al {{ selectedBooking.ends_at }}</p>
          <p><strong class="text-slate-700">Total:</strong> ${{ Number(selectedBooking.total_price || 0).toFixed(2) }}</p>
          <p><strong class="text-slate-700">Estado:</strong> <span class="capitalize font-semibold">{{ selectedBooking.status }}</span></p>
        </div>

        <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button class="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition" @click="selectedBooking = null">
            Cerrar
          </button>
          <NuxtLink :to="`/bookings/${selectedBooking.id}`" :prefetch="false" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
            Ver Ficha Completa
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { bookingService } from '~/services/bookingService'

useHead({ title: 'Calendario de Ocupación' })

const selectedBooking = ref(null)

const colorMap = {
  confirmed: '#10b981',
  pending: '#f59e0b',
  cancelled: '#f43f5e'
}

const fetchEvents = async (info, successCallback, failureCallback) => {
  try {
    const res = await bookingService().getCalendar({
      start_date: info.startStr.substring(0, 10),
      end_date: info.endStr.substring(0, 10)
    })

    const bookings = res.data || res || []

    const events = bookings.map((item) => ({
      id: item.id,
      title: `${item.media?.name || 'Espacio'} (${item.customer?.name || 'Cliente'})`,
      start: item.starts_at,
      // Hora a la que termina el dia
      end: `${item.ends_at}T23:59:59`,
      backgroundColor: colorMap[item.status] || '#64748b',
      borderColor: colorMap[item.status] || '#64748b',
      extendedProps: item
    }))

    successCallback(events)
  } catch (err) {
    failureCallback(err)
  }
}

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locales: [esLocale],
  locale: 'es',
  firstDay: 1,
  headerToolbar: {
    left: 'prev,today,next',
    center: 'title',
    right: ''
  },
  buttonText: { today: 'Hoy' },
  events: fetchEvents,
  eventClick: (info) => (selectedBooking.value = info.event.extendedProps)
}
</script>

<style>
.fc {
  --fc-border-color: #f1f5f9;
  --fc-page-bg-color: #ffffff;
  --fc-today-bg-color: #f8fafc;
  font-family: inherit;
}
.fc .fc-toolbar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  text-transform: capitalize;
}
.fc .fc-button {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #334155 !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  text-transform: capitalize;
}
.fc .fc-col-header-cell {
  background-color: #f8fafc;
  padding: 8px 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
}
.fc-daygrid-event {
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}
</style>