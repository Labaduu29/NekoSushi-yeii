<template>
  <div id="app">
    <MenuComponent />
    <router-view />
  </div>
</template>

<script>
import MenuComponent from '@/components/MenuNumero1.vue'

export default {
  components: {
    MenuComponent
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}
</style>