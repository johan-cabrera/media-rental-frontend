# Publimovil - Frontend de Gestión y Alquiler de Espacios Publicitarios

Aplicación web desarrollada con **Nuxt 3**, **Vue 3** y **Tailwind CSS** para administrar espacios publicitarios, clientes y reservas, con exportacion de reportes y visualizacion grafica de reservas.

---

## Requisitos de instalacion

* **Node.js:** Versión `>= 18.x` 
* **Gestor de Paquetes:** `npm` `>= 9.x` 
* **Navegador Web:** 

---

## Proceso de instalacion

1. Clonar el repositorio localmente:
   ```bash
   git clone https://github.com/johan-cabrera/media-rental-frontend
   cd media-rental-frontend
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

## Creacion de variables de entorno

Crear el archivo `.env` en la raíz del proyecto con la URL base apuntando a la API de Laravel:

```env
# URL base de la API backend
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

> **Nota:** En caso de que el backend corra en otro puerto, ajustarlo.

---

## Comando para correr el proyecto

**Desarrollo** | `npm run dev` | Inicia el servidor local con Hot Reload en `http://localhost:3000` |


## Explicacion de decisiones tecnicas

* **Enrutamiento Explicito (`app/router.options.js`):**  
  Se configuró el enrutador manualmente para evitar colisiones entre rutas fijas y dinámicas.

* **Integración de FullCalendar v6 del Lado del Cliente:**  
  Se utilizo la suite `@fullcalendar/vue3` (v6.1.15) junto con los plugins `@fullcalendar/daygrid` y `@fullcalendar/interaction`. Para el manejo de la interfaz del calendario.

* **Optimización de Carga de Reservas por Rango de fechas:**  
  En lugar de utilizar peticiones paginadas, se utilizan las propiedades `startStr` y `endStr` provistas por FullCalendar para consultar a la API (`GET /api/bookings/calendar`) unicamente los eventos comprendidos dentro del mes visualizado en pantalla.

* **Modularización de Consumo HTTP (`~/services` y composable `useApi`):**  
  Se centralizaron las operaciones hacia el backend en capas de servicio dedicadas (`bookingService`, `mediaService`), abstrayendo las llamadas HTTP y reutilizando la gestion de tokens de sesion y encabezados de autorizacion.

* **Exportación de Reportes CSV en Memoria:**  
  La funcionalidad de exportacion consume el flujo de datos del backend transformandolo en un objeto `Blob` con tipo `text/csv`, forzando la descarga directa en el navegador a traves de un enlace dinamico temporal, evitando redirecciones o recargas innecesarias de pagina.