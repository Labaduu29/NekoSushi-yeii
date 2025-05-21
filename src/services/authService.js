import api from '../Api/IndexApi';

export default {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await api.post('/usuarios/registro', userData);
      this._storeAuthData(response.data);
      return response.data;
    } catch (error) {
      throw this._handleAuthError(error);
    }
  },

  // Login de usuario
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials); // o '/usuarios/login' según tu backend
      this._storeAuthData(response.data);
      return response.data;
    } catch (error) {
      throw this._handleAuthError(error);
    }
  },

  // Refrescar token, si tu backend lo soporta
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      this._storeAuthData(response.data);
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expiration');
  },

  // Verificar autenticación
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token && !this._isTokenExpired();
  },

  // Obtener usuario logueado
  getCurrentUser() {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  // Métodos HTTP genéricos
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw this._handleHttpError(error);
    }
  },

  async post(url, data, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this._handleHttpError(error);
    }
  },

  async put(url, data, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this._handleHttpError(error);
    }
  },

  async patch(url, data, config = {}) {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this._handleHttpError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw this._handleHttpError(error);
    }
  },

  // Privados
  _storeAuthData(data) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    localStorage.setItem('token_expiration', data.expiresAt);
  },

  _isTokenExpired() {
    const expiration = localStorage.getItem('token_expiration');
    return expiration && new Date(expiration) < new Date();
  },

  _handleAuthError(error) {
    const message = error.response?.data?.message || error.message || 'Error de autenticación';
    return new Error(message);
  },

  _handleHttpError(error) {
    const message = error.response?.data?.message || error.message || 'Error en la solicitud';
    return new Error(message);
  }
};