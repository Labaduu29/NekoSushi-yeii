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
    </div>

    <!-- Panel Derecho con imagen -->
    <div class="image-container">
      <img
        src="https://mrtsbakery.com.au/cdn/shop/articles/unnamed_388f2e43-0619-438d-9212-2539bf2c70d5_800x.jpg?v=1578206798"
        alt="Sushi Login"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const isLoginMode = ref(true)
const users = ref({})

onMounted(() => {
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) users.value = JSON.parse(storedUsers)
})

const handleSubmit = () => {
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

  if (isLoginMode.value) {
    if (users.value[userEmail] === password.value) {
      success.value = '¡Inicio de sesión exitoso!'
    } else {
      error.value = 'Correo o contraseña incorrectos.'
    }
  } else {
    if (password.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden.'
      return
    }

    if (users.value[userEmail]) {
      error.value = 'El usuario ya está registrado.'
      return
    }

    users.value[userEmail] = password.value
    localStorage.setItem('users', JSON.stringify(users.value))
    success.value = '¡Registro exitoso!'
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
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

.logo {
  font-size: 2rem;
  color: #f5c242;
  margin-bottom: 1.5rem;
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

/* Responsive para pantallas pequeñas */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }

  .image-container img {
    height: 300px;
  }
}
</style>
