import api from '@/api';

export default {
  /**
   * Registrar nuevo usuario
   * @param {Object} userData 
   * @param {string} userData.nombre
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} userData.rol - 'cliente' o 'admin'
   */
  async register(userData) {
    try {
      const response = await api.post('/usuarios/registro', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  /**
   * Iniciar sesión
   * @param {Object} credentials 
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  async login(credentials) {
    try {
      const response = await api.post('/usuarios/login', credentials);
      
      // Guardar token y datos de usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  /**
   * Obtener perfil del usuario
   */
  async getProfile() {
    try {
      const response = await api.get('/usuarios/perfil');
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};