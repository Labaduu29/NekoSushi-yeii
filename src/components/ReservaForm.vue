<template>
  <div>
    <MenuComponent />
    <router-view />
    <div class="reserva-wrapper">
      <div class="reserva-container">
        <h2>Reserva tu tatami🍣</h2>

        <form @submit.prevent="enviarReserva" class="formulario">
          <label>Nombre:</label>
          <input
            v-model="reserva.nombre"
            type="text"
            required
            placeholder="Tu nombre ronroneante..."
          />

          <label>Correo:</label>
          <input
            v-model="reserva.email"
            type="email"
            required
            placeholder="tusushi@nekosama.com"
          />

          <label>Fecha:</label>
          <input v-model="reserva.fecha" type="date" required />

          <label>Hora:</label>
          <input v-model="reserva.hora" type="time" required />

          <label>Número de personas:</label>
          <input v-model="reserva.personas" type="number" min="1" required />

          <div v-if="mesas.length > 0">
            <label>Elige tu tatami favorito:</label>
            <div class="mesas-lista">
              <button
                v-for="mesa in mesas"
                :key="mesa.id"
                :disabled="mesa.reservada"
                :class="{ seleccionada: mesaSeleccionada === mesa.id, ocupada: mesa.reservada }"
                @click.prevent="mesaSeleccionada = mesa.id"
              >
                🍵 Tatami {{ mesa.numero }}
              </button>
            </div>
          </div>

          <button type="submit" class="reserva-btn">Reservar 🐾</button>

          <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MenuComponent from '../components/MenuNumero1.vue'

// Datos de la reserva
const reserva = ref({
  nombre: '',
  email: '',
  fecha: '',
  hora: '',
  personas: 1,
})

const mensaje = ref('')
const mesaSeleccionada = ref(null)

//  mesas disponibles 
const mesas = ref([
  { id: 1, numero: 'A1', reservada: false },
  { id: 2, numero: 'A2', reservada: true },
  { id: 3, numero: 'B1', reservada: false },
  { id: 4, numero: 'B2', reservada: false },
  { id: 5, numero: 'C1', reservada: true },
  { id: 6, numero: 'C2', reservada: false },
])

// Validación: solo letras en el nombre
watch(
  () => reserva.value.nombre,
  (nuevoValor) => {
    const soloLetras = nuevoValor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    if (nuevoValor !== soloLetras) {
      reserva.value.nombre = soloLetras
    }
  }
)

// Simulamos el envío de la reserva
const enviarReserva = async () => {
  if (!mesaSeleccionada.value) {
    mensaje.value = '😿 Por favor elige un tatami antes de reservar.'
    return
  }

  try {
    // Aquí iría el fetch real...
    console.log('Reserva enviada:', {
      ...reserva.value,
      mesa: mesaSeleccionada.value,
    })

    mensaje.value = '¡Miau! Tu reserva fue recibida con éxito 🐟'
    reserva.value = {
      nombre: '',
      email: '',
      fecha: '',
      hora: '',
      personas: 1,
    }
    mesaSeleccionada.value = null
  } catch (error) {
    console.error('Error al reservar:', error)
    mensaje.value = 'Error de conexión. Intenta más tarde.'
  }
}
</script>
<style scoped>
.reserva-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('https://wallpaperaccess.com/full/5388777.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
}

.reserva-container {
  background: #2c2c2c;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 0 20px #00000066;
  max-width: 420px;
  width: 100%;
  text-align: center;
  color: #f5f5f5;
  font-family: 'Noto Serif JP', serif;
}

h2 {
  font-size: 26px;
  margin-bottom: 20px;
  color: #2b94c5; /* dorado */
  font-weight: bold;
}

.formulario label {
  display: block;
  margin: 12px 0 6px;
  text-align: left;
  color: #f5f5f5;
  font-weight: 600;
}

.formulario input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #555;
  background-color: #3a3a3a;
  color: #f5f5f5;
  font-size: 16px;
  transition: 0.3s ease;
}

.formulario input:focus {
  outline: none;
  border-color: #4f848f;
  background-color: #4a4a4a;
}

.mesas-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.mesas-lista button {
  padding: 10px 12px;
  background-color: #444;
  border: 2px solid #888;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #f5f5f5;
  transition: 0.3s;
}

.mesas-lista button:hover:not(.ocupada):not(.seleccionada) {
  background-color: #666;
}

.mesas-lista button.seleccionada {
  background-color: #24a4a9;
  color: #1e1e1e;
  border-color: #346c85;
}

.mesas-lista button.ocupada {
  background-color: #777;
  color: #aaa;
  border-color: #555;
  cursor: not-allowed;
}

button.reserva-btn {
  font-size: 14px;
  padding: 10px 20px;
  background-color: #4d99bc;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s, transform 0.2s;
}

button.reserva-btn:hover {
  background-color: #366687;
  transform: scale(1.05);
  box-shadow: 0 0 10px #00000033;
}

.mensaje {
  margin-top: 18px;
  font-weight: bold;
  color: #266c7f;
  animation: fadein 0.6s ease-in;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
