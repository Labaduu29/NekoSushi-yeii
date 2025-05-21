<template>
  <div class="main-bg">
    <div class="login-card">
      <div class="card-image">
        <img
          src="https://mrtsbakery.com.au/cdn/shop/articles/unnamed_388f2e43-0619-438d-9212-2539bf2c70d5_800x.jpg?v=1578206798"
          alt="Sushi Login"
        />
      </div>
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
  background: linear-gradient(120deg, #232526 0%, #414345 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #0007, 0 1.5px 8px 0 #23252625;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-width: 350px;
  width: 95vw;
  max-width: 760px;
}
.card-image {
  flex: 1 1 240px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-image img {
  width: 100%;
  height: 100%;
  min-width: 180px;
  object-fit: cover;
  object-position: center;
}
.card-content {
  flex: 2 1 350px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f7f4ed;
}
.center-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #36332e;
  font-weight: 700;
}
.login-form, .formulario-reserva {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  color: #494949;
  font-size: 1rem;
  margin-bottom: 0.1rem;
}
input {
  background: #f6f6f6;
  border: 1px solid #d2c9bb;
  border-radius: 6px;
  padding: 0.6rem;
  font-size: 1rem;
  color: #1b1b1b;
}
input:focus {
  outline: 2px solid #f5c242;
}
.main-btn {
  background: linear-gradient(90deg, #f5c242 60%, #e3ae37 100%);
  color: #232526;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  font-size: 1.09rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 #e8d9a2a9;
}
.main-btn:hover {
  background: linear-gradient(90deg, #ffdc7d 70%, #f5c242 100%);
}
.logout-btn {
  background: #e67474 !important;
  color: #fff !important;
  margin-top: 1rem !important;
  box-shadow: 0 2px 8px 0 #e67474a9;
}
.logout-btn:hover {
  background: #e23c3c !important;
}
.reserva-btn {
  margin-top: 1rem !important;
}
.mesas-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
}
.mesas-lista button {
  padding: 0.6rem 1rem;
  background-color: #444;
  border: 2px solid #888;
  border-radius: 6px;
  cursor: pointer;
  color: #f5f5f5;
  transition: 0.3s;
  margin: 0;
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
.mensaje {
  margin-top: 1rem;
  color: #4d99bc;
  font-weight: bold;
  text-align: center;
}
.error {
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
}
.success {
  color: #8be78b;
  margin-top: 1rem;
  text-align: center;
}
.switch-mode {
  margin-top: 1.5rem;
  text-align: center;
}
.switch-mode a {
  color: #f5c242;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}
.switch-mode a:hover {
  color: #f7d35e;
}
@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    max-width: 95vw;
  }
  .card-image {
    min-height: 170px;
    max-height: 260px;
  }
  .card-content {
    padding: 1.7rem 1.2rem;
  }
}
</style>