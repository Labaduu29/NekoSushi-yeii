<!-- src/pages/PagMisReservas.vue -->
<template>
    <div class="mis-reservas">
      <h1>Mis Reservas</h1>
      <p v-if="!userEmail">No has iniciado sesión.</p>
      <div v-else>
        <p>Bienvenido, {{ userEmail }}</p>
        <ul v-if="reservas.length">
          <li v-for="(reserva, index) in reservas" :key="index">
            {{ reserva }}
          </li>
        </ul>
        <p v-else>No tienes reservas todavía.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const userEmail = ref('')
  const reservas = ref([])
  
  onMounted(() => {
    userEmail.value = localStorage.getItem('currentUser')
    const allReservas = JSON.parse(localStorage.getItem('reservas')) || {}
    reservas.value = allReservas[userEmail.value] || []
  })
  </script>
  
  <style scoped>
  .mis-reservas {
    padding: 2rem;
    background-color: #1f1f1f;
    color: #fff8e7;
  }
  
  h1 {
    color: #f5c242;
    margin-bottom: 1rem;
  }
  </style>
  