<template>
  <div class="main-bg">
    <div class="login-card">
      <!-- FORMULARIO A LA IZQUIERDA -->
      <div class="card-content">
        <h2 class="center-title">{{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}</h2>
        <form v-if="!showReservation" @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" required minlength="6" />
          </div>
          <div class="form-group" v-if="!isLoginMode">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" required minlength="6" />
          </div>
          <button type="submit" class="main-btn">
            {{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
        </form>

        <div v-if="isLoggedIn && showReservation" class="reservation-section">
          <h3 class="center-title">Reservar Tatami</h3>
          <form @submit.prevent="enviarReserva" class="formulario-reserva">
            <div class="form-group">
              <label>Fecha:</label>
              <input v-model="reserva.fecha" type="date" :min="hoy" required @change="fetchTatamisDisponibles" />
            </div>
            <div class="form-group">
              <label>Hora:</label>
              <input v-model="reserva.hora" type="time" required @change="fetchTatamisDisponibles" />
            </div>
            <div class="form-group">
              <label>Número de personas:</label>
              <input v-model.number="reserva.personas" type="number" min="1" required @change="fetchTatamisDisponibles" />
            </div>
            <div v-if="mesas.length > 0" class="form-group">
              <label>Elige tu tatami favorito:</label>
              <div class="mesas-lista">
                <button
                  v-for="mesa in mesas"
                  :key="mesa.id"
                  :disabled="mesa.reservada"
                  :class="{ seleccionada: mesaSeleccionada === mesa.id, ocupada: mesa.reservada }"
                  @click.prevent="mesaSeleccionada = mesa.id"
                >
                  🍵 {{ mesa.nombre }} (capacidad: {{ mesa.capacidad }})
                </button>
              </div>
            </div>
            <button type="submit" class="main-btn reserva-btn">Reservar 🐾</button>
            <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
          </form>
        </div>

        <div v-if="isLoggedIn && !showReservation" class="center-title">
          <button class="main-btn" @click="showReservation = true">Reservar Tatami</button>
        </div>

        <div v-if="isLoggedIn" class="center-title">
          <button @click="logout" class="main-btn logout-btn">Cerrar sesión</button>
        </div>

        <div v-else>
          <p class="switch-mode">
            <a href="#" @click.prevent="toggleMode">
              {{ isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
            </a>
          </p>
        </div>
      </div>
      <!-- IMAGEN A LA DERECHA -->
      <div class="card-image">
        <img
          src="https://mrtsbakery.com.au/cdn/shop/articles/unnamed_388f2e43-0619-438d-9212-2539bf2c70d5_800x.jpg?v=1578206798"
          alt="Sushi Login"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

// Estado reactivo de sesión
const token = ref(localStorage.getItem('token') || null)
const isLoggedIn = computed(() => !!token.value)
const showReservation = ref(false)

// Login/Registro
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const isLoginMode = ref(true)

// Reserva
const hoy = new Date().toISOString().split('T')[0]
const reserva = ref({ fecha: '', hora: '', personas: 1 })
const mensaje = ref('')
const mesaSeleccionada = ref(null)
const mesas = ref([])

function limpiarMensajes() {
  error.value = ''
  success.value = ''
  mensaje.value = ''
}

const handleSubmit = async () => {
  limpiarMensajes()
  const userEmail = email.value.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userEmail)) {
    error.value = 'Correo inválido.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  try {
    if (isLoginMode.value) {
      // Iniciar sesión
      const res = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail, password: password.value })
      })
      const data = await res.json()
      if (res.ok) {
        success.value = data.mensaje || '¡Inicio de sesión exitoso!'
        localStorage.setItem('userEmail', userEmail)
        if (data.token) {
          localStorage.setItem('token', data.token)
          token.value = data.token
        }
        setTimeout(() => {
          limpiarFormularios()
          showReservation.value = false
        }, 800)
      } else {
        error.value = data.error || data.mensaje || 'Correo o contraseña incorrectos.'
      }
    } else {
      // Registro
      if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.'
        return
      }
      const res = await fetch('http://localhost:3000/usuarios/registro', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail, password: password.value, nombre: "Cliente" })
      })
      const data = await res.json()
      if (res.ok) {
        success.value = '¡Registro exitoso! Ahora puedes iniciar sesión.'
        setTimeout(() => {
          toggleMode()
        }, 1200)
      } else {
        error.value = data.error || data.mensaje || 'El usuario ya está registrado.'
      }
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor.'
  }
}

const enviarReserva = async () => {
  limpiarMensajes()
  if (!reserva.value.fecha || !reserva.value.hora || !reserva.value.personas) {
    mensaje.value = 'Completa todos los campos.'
    return
  }
  if (reserva.value.personas < 1) {
    mensaje.value = 'Debe ser al menos 1 persona.'
    return
  }
  const fechaHoy = new Date(hoy)
  const fechaSeleccionada = new Date(reserva.value.fecha)
  if (fechaSeleccionada < fechaHoy) {
    mensaje.value = 'La fecha no puede ser pasada.'
    return
  }
  if (!mesaSeleccionada.value) {
    mensaje.value = '😿 Por favor elige un tatami antes de reservar.'
    return
  }
  const localToken = localStorage.getItem('token')
  if (!localToken) {
    mensaje.value = 'Debes iniciar sesión para reservar.'
    return
  }
  try {
    const res = await fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localToken}`
      },
      body: JSON.stringify({
        fecha: reserva.value.fecha,
        hora: reserva.value.hora,
        numero_personas: reserva.value.personas,
        tatami_id: mesaSeleccionada.value
      })
    })
    const data = await res.json()
    if (res.ok) {
      mensaje.value = '¡Miau! Tu reserva fue recibida con éxito 🐟'
      limpiarReserva()
      setTimeout(() => { showReservation.value = false }, 2000)
    } else {
      mensaje.value = data.error || 'Error al reservar.'
    }
  } catch (error) {
    mensaje.value = 'Error de conexión. Intenta más tarde.'
  }
}

// Cargar tatamis disponibles desde el backend según la fecha, hora y personas elegidas
async function fetchTatamisDisponibles() {
  if (!reserva.value.fecha || !reserva.value.hora || !reserva.value.personas) {
    mesas.value = []
    return
  }
  try {
    const res = await fetch(
      `http://localhost:3000/tatamis/disponibles?fecha=${reserva.value.fecha}&hora=${reserva.value.hora}&personas=${reserva.value.personas}`
    )
    const data = await res.json()
    if (res.ok) {
      mesas.value = data
      // Si el tatami seleccionado ya no está disponible, deselecciona
      if (!mesas.value.some(m => m.id === mesaSeleccionada.value && !m.reservada)) {
        mesaSeleccionada.value = null
      }
    } else {
      mesas.value = []
    }
  } catch (e) {
    mesas.value = []
  }
}

function limpiarFormularios() {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  limpiarReserva()
}

function limpiarReserva() {
  reserva.value = { fecha: '', hora: '', personas: 1 }
  mesaSeleccionada.value = null
  mensaje.value = ''
  mesas.value = []
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  token.value = null
  limpiarMensajes()
  limpiarFormularios()
  showReservation.value = false
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value
  limpiarMensajes()
  limpiarFormularios()
  showReservation.value = false
}
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  background: #181818;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.login-card {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  background: none;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  overflow: hidden;
}

.card-content {
  flex: 1 1 0;
  padding: 3.5rem 2.5rem 2.5rem 4rem;
  background: #222220;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  border-right: 3px solid #f5c242;
  height: 100vh;
  box-sizing: border-box;
}

.card-image {
  flex: 1 1 0;
  min-width: 0;
  background: #181818;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  height: 100vh;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 0;
  display: block;
}

/* El resto de tu CSS sigue igual */
.center-title {
  text-align: left;
  margin-bottom: 1.2rem;
  color: #ffd84f;
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: 0.01em;
}
.login-form, .formulario-reserva {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 0.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  color: #f1e1b0;
  font-size: 1.07rem;
  margin-bottom: 0.1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}
input {
  background: #232223;
  border: 1.7px solid #444;
  border-radius: 7px;
  padding: 0.66rem 0.9rem;
  font-size: 1.03rem;
  color: #fff;
  transition: outline 0.2s, border-color 0.2s, background 0.2s;
}
input:focus {
  outline: 2px solid #f5c242;
  border-color: #f5c242;
  background: #2a2a1a;
}
input[type="date"], input[type="time"] {
  color-scheme: dark;
}
.main-btn {
  background: #3a3c3a;
  color: #ffe68a;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.7rem;
  font-weight: bold;
  font-size: 1.09rem;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  transition: background 0.18s, box-shadow 0.15s, color 0.2s;
  box-shadow: 0 2px 8px 0 #111a;
  letter-spacing: 0.03em;
}
.main-btn:hover, .main-btn:focus {
  background: #ffd84f;
  color: #232526;
  box-shadow: 0 4px 12px 0 #ffe6a299;
}
.logout-btn {
  background: #e67474 !important;
  color: #fff !important;
  margin-top: 1.4rem !important;
  box-shadow: 0 2px 8px 0 #e67474a9;
}
.logout-btn:hover, .logout-btn:focus {
  background: #e23c3c !important;
  box-shadow: 0 4px 12px 0 #e67474c9;
}
.reserva-btn {
  margin-top: 1rem !important;
  background: #3cb5e9;
  color: #fff;
}
.reserva-btn:hover, .reserva-btn:focus {
  background: #60caf7;
  color: #232526;
}
.mesas-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  margin: 10px 0 0 0;
}
.mesas-lista button {
  padding: 0.6rem 1.1rem;
  background-color: #242424;
  border: 2px solid #555;
  border-radius: 7px;
  cursor: pointer;
  color: #f5f5f5;
  font-weight: 600;
  font-size: 1.01rem;
  transition: 0.22s;
  margin: 0;
  min-width: 120px;
  letter-spacing: 0.01em;
  display: flex; align-items: center; gap: 0.4em;
}
.mesas-lista button.seleccionada {
  background-color: #ffd84f;
  color: #232526;
  border-color: #f5c242;
  font-weight: bold;
}
.mesas-lista button.ocupada {
  background-color: #333;
  color: #bcbcbc;
  border-color: #555;
  cursor: not-allowed;
  font-weight: normal;
  text-decoration: line-through;
}
.mensaje {
  margin-top: 1rem;
  color: #60caf7;
  font-weight: bold;
  text-align: center;
  font-size: 1.07rem;
  letter-spacing: 0.01em;
}
.error {
  color: #e23c3c;
  background: #362727;
  padding: 0.5em 0.7em;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}
.success {
  color: #24a947;
  background: #1d3627;
  padding: 0.5em 0.7em;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}
.switch-mode {
  margin-top: 1.7rem;
  text-align: left;
}
.switch-mode a {
  color: #ffd84f;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.07rem;
  transition: color 0.2s;
  letter-spacing: 0.01em;
}
.switch-mode a:hover {
  color: #fff2a0;
  text-decoration: underline;
}
.reservation-section {
  background: #252522;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 #f5c24225;
  padding: 1.5rem 1rem;
  margin-top: 0.5rem;
}
::-webkit-input-placeholder { color: #b7ae8d; }
::-moz-placeholder { color: #b7ae8d; }
:-ms-input-placeholder { color: #b7ae8d; }
::placeholder { color: #b7ae8d; }
@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    max-width: 100vw;
    max-height: 100vh;
  }
  .card-image {
    min-height: 170px;
    max-height: 320px;
    border-left: none;
    border-top: 3px solid #f5c242;
    height: 40vh;
    width: 100vw;
  }
  .card-content {
    border-right: none;
    border-bottom: 3px solid #f5c242;
    padding: 1.7rem 1rem 1.1rem 1rem;
    height: 60vh;
    width: 100vw;
  }
}
@media (max-width: 600px) {
  .login-card {
    min-width: 100vw;
    max-width: 100vw;
    border-radius: 0;
  }
  .card-image {
    border-radius: 0;
    min-width: 100vw;
    min-height: 150px;
    height: 35vh;
  }
  .card-content {
    padding: 1.1rem 0.5rem;
    min-width: 100vw;
    height: 65vh;
  }
}
</style>