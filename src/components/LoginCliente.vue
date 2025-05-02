<template>
    <div class="login-container">
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
        <button type="submit">{{ isLoginMode ? 'Iniciar sesión' : 'Registrarse' }}</button>
      </form>
  
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
  
      <p class="switch-mode">
        <a href="#" @click.prevent="toggleMode">
          {{ isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </a>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Simulación de una base de datos local en memoria
  const users = ref({})
  
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref('')
  const success = ref('')
  const isLoginMode = ref(false)
  
  const handleSubmit = () => {
    error.value = ''
    success.value = ''
  
    const userEmail = email.value.trim().toLowerCase()
  
    if (isLoginMode.value) {
      // Modo login
      if (users.value[userEmail] && users.value[userEmail] === password.value) {
        success.value = '¡Inicio de sesión exitoso!'
      } else {
        error.value = 'Correo o contraseña incorrectos.'
      }
    } else {
      // Modo registro
      if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.'
        return
      }
  
      if (users.value[userEmail]) {
        error.value = 'El usuario ya está registrado.'
        return
      }
  
      users.value[userEmail] = password.value
      success.value = '¡Registro exitoso!'
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
    }
  }
  
  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    error.value = ''
    success.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  }
  </script>
  
 <style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 15px;
  background: rgba(25, 25, 25, 0.85); /* fondo oscuro translúcido */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  color: #2c2b2a; /* tono cálido claro */
  font-family: 'Segoe UI', sans-serif;
  backdrop-filter: blur(4px);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #266c7f; /* dorado tenue */
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e0c9a6;
}

input {
  width: 100%;
  padding: 0.6rem;
  background-color: #2f2f2f;
  color: #f9f5ee;
  border: 1px solid #5c4b3b;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.6rem;
  margin-top: 1rem;
  background-color: #f5c242;
  color: #1f1f1f;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f5c242;
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
  text-decoration: underline;
  cursor: pointer;
}
</style>

  