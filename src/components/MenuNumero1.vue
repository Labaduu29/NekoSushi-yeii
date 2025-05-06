<template>
  <div class="menu">
    
    <ul v-if="menuOpen" class="dropdown-menu">
      <li>Inicio</li>
      <li>Acerca de</li>
      <li>Contacto</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MenuComponent",
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>