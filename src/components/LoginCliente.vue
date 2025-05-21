<template>

<div class="login-wrapper"> 
  <!-- Panel Izquierdo --> 
  <div class="form-container"> 
    <h2>{{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <div class="form-group" v-if="!isLoginMode">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>

      <button type="submit">
        {{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>

    <p class="switch-mode">
      <a href="#" @click.prevent="toggleMode">
        {{ isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </a>
    </p>

    <!-- Sección de Reserva (solo visible en modo de iniciar sesión) -->
    <div v-if="isLoginMode" class="reservation-section">
      <form @submit.prevent="enviarReserva" class="formulario-reserva">
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
            <p class="switch-mode">
      <a href="#" @click.prevent="toggleMode">
        {{ isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </a>
    </p>
<button type="submit">
        {{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}
      </button>


        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      </form>
    </div>
  </div>

  <!-- Panel Derecho con imagen (se mantiene igual) -->
  <div class="image-container">
    <img
      src="https://mrtsbakery.com.au/cdn/shop/articles/unnamed_388f2e43-0619-438d-9212-2539bf2c70d5_800x.jpg?v=1578206798"
      alt="Sushi Login"
    />
  </div>
</div> 

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos del Login/Registro
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const isLoginMode = ref(true)

// Datos de la Reserva
const reserva = ref({ fecha: '', hora: '', personas: 1 })
const mensaje = ref('')
const mesaSeleccionada = ref(null)
const mesas = ref([
  { id: 1, numero: 'A1', reservada: false },
  { id: 2, numero: 'A2', reservada: true },
  { id: 3, numero: 'B1', reservada: false },
  { id: 4, numero: 'B2', reservada: false },
  { id: 5, numero: 'C1', reservada: true },
  { id: 6, numero: 'C2', reservada: false },
])

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  const userEmail = email.value.trim().toLowerCase()
  if (!userEmail.includes('@')) {
    error.value = 'Correo inválido.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  try {
    if (isLoginMode.value) {
      // 🔐 Iniciar sesión
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: password.value })
      })
      const data = await res.json()
      if (res.ok) {
        success.value = '¡Inicio de sesión exitoso!'
        localStorage.setItem('userEmail', userEmail)
        // Aquí puedes redirigir a la página de reservas si es necesario
      } else {
        error.value = data.message || 'Correo o contraseña incorrectos.'
      }
    } else {
      // 📝 Registrarse
      if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.'
        return
      }
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: password.value })
      })
      const data = await res.json()
      if (res.ok) {
        success.value = '¡Registro exitoso!'
        localStorage.setItem('userEmail', userEmail)
        // Aquí puedes redirigir a la página de reservas si es necesario
      } else {
        error.value = data.message || 'El usuario ya está registrado.'
      }
    }
  } catch (err) {
    error.value = 'Error de conexión con el servidor.'
    console.error(err)
  }
}

const enviarReserva = async () => {
  if (!mesaSeleccionada.value) {
    mensaje.value = '😿 Por favor elige un tatami antes de reservar.'
    return
  }
  try {
    console.log('Reserva enviada:', { ...reserva.value, mesa: mesaSeleccionada.value })
    mensaje.value = '¡Miau! Tu reserva fue recibida con éxito 🐟'
    reserva.value = { fecha: '', hora: '', personas: 1 }
    mesaSeleccionada.value = null
    // Redirigir después de 2 segundos
    setTimeout(() => { router.push('/') }, 2000)
  } catch (error) {
    console.error('Error al reservar:', error)
    mensaje.value = 'Error de conexión. Intenta más tarde.'
  }
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  error.value = ''
  success.value = ''
}
</script>

<style scoped>
/* Estilos existentes del login (se mantienen igual) */
.login-wrapper {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
  background-color: #1f1f1f;
}

.form-container {
  flex: 1 1 400px;
  padding: 3rem;
  background-color: #1f1f1f;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 300px;
}

.image-container {
  flex: 1 1 400px;
  background-color: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-left: 5px solid #f5c242;
}

h2 {
  color: #f5c242;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #e0c9a6;
}

input {
  width: 100%;
  padding: 0.6rem;
  background-color: #2f2f2f;
  border: 1px solid #5c4b3b;
  color: #fff8e7;
  border-radius: 6px;
}

button {
  width: fit-content;
  padding: 0.6rem 1.5rem;
  margin: 1rem auto 0;
  background-color: #f5c242;
  color: #1f1f1f;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
}

button:hover {
  background-color: #f7d35e;
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

/* Nuevos estilos para la sección de reserva */
.reservation-section {
  color: #fff;
}

.formulario-reserva {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formulario-reserva label {
  display: block;
  margin-bottom: 0.3rem;
  color: #e0c9a6;
  text-align: left;
}

.formulario-reserva input {
  width: 100%;
  padding: 0.6rem;
  background-color: #2f2f2f;
  border: 1px solid #5c4b3b;
  color: #fff8e7;
  border-radius: 6px;
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

.reserva-btn {
  background-color: #4d99bc !important;
  color: #1e1e1e !important;
  margin-top: 1rem !important;
}

.reserva-btn:hover {
  background-color: #366687 !important;
}

.mensaje {
  margin-top: 1rem;
  color: #4d99bc;
  font-weight: bold;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }
  .image-container img {
    height: 300px;
  }
}
</style>