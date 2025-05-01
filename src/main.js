import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios"; 

// 2. Configuración global de Axios (opcional pero recomendado)
axios.defaults.baseURL = " http://10.10.8.237:3000 "; // Reemplaza con tu URL base
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// 3. Interceptores (opcional: para manejo global de errores o autenticación)
axios.interceptors.request.use(
  (config) => {
    // Añadir token de autenticación si existe
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirigir a login si el token es inválido o expira
    if (error.response?.status === 401) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

// 4. Crear la instancia de Vue
const app = createApp(App);

// 5. Hacer Axios disponible globalmente en componentes (this.$axios)
app.config.globalProperties.$axios = axios;

// 6. Usar Vue Router (se mantiene igual que antes)
app.use(router);

// 7. Montar la aplicación
app.mount("#app");