<template>
  <div class="menu-container">
    <nav class="menu">
      <div class="menu-title">Neko Sushi 🍣</div>
      <ul class="menu-items">
        <li @click="$router.push('/')">Volver</li>
        <li @click="$router.push('/PagReserva')">¡Reserva Aquí!</li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "MenuComponent",
};
</script>

<style scoped>
.menu-container {
  min-height: 100vh;
  background-color: #fafafa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #010006, #15141a);
  border-bottom: 2px solid #11141a;
  box-shadow: 0 4px 10px rgba(14, 27, 55, 0.7);
}

.menu-title {
  color: #fefefe;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.menu-items {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-items li {
  padding: 0.6rem 1.6rem;
  background: linear-gradient(135deg, #243b55, #141e30);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(47, 18, 59, 0.3);
}

.menu-items li:hover {
  background: linear-gradient(135deg, #2b2b6f, #5e5ecf);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 12px rgba(206, 210, 211, 0.4);
}
</style>
