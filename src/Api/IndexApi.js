import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.10.8.237:3000', // URL base de tu backend
  headers: { 'Content-Type': 'application/json' }, // Configuración de headers
});

// Interceptor para añadir token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api; // Exporta la instancia configurada