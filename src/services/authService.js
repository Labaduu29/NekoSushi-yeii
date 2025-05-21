import api from '../Api/IndexApi'  // Ruta relativa correcta

export default {
  // Métodos de autenticación
  async register(userData) {
    try {
      const response = await api.post('/usuarios/registro', userData)
      this._storeAuthData(response.data)
      return response.data
    } catch (error) {
      this._handleAuthError(error)
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      this._storeAuthData(response.data)
      return response.data
    } catch (error) {
      this._handleAuthError(error)
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token')
      this._storeAuthData(response.data)
      return response.data
    } catch (error) {
      this.logout()
      throw error
    }
  },

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('token_expiration')
  },

  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    return !!token && !this._isTokenExpired()
  },

  getCurrentUser() {
    const user = localStorage.getItem('user_data')
    return user ? JSON.parse(user) : null
  },

  // Métodos generales HTTP
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config)
      return response.data
    } catch (error) {
      throw this._handleHttpError(error)
    }
  },

  async post(url, data, config = {}) {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw this._handleHttpError(error)
    }
  },

  async put(url, data, config = {}) {
    try {
      const response = await api.put(url, data, config)
      return response.data
    } catch (error) {
      throw this._handleHttpError(error)
    }
  },

  async patch(url, data, config = {}) {
    try {
      const response = await api.patch(url, data, config)
      return response.data
    } catch (error) {
      throw this._handleHttpError(error)
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config)
      return response.data
    } catch (error) {
      throw this._handleHttpError(error)
    }
  },

  // Métodos privados
  _storeAuthData(data) {
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_data', JSON.stringify(data.user))
    localStorage.setItem('token_expiration', data.expiresAt)
  },

  _isTokenExpired() {
    const expiration = localStorage.getItem('token_expiration')
    return expiration && new Date(expiration) < new Date()
  },

  _handleAuthError(error) {
    const message = error.response?.data?.message || error.message || 'Error de autenticación'
    throw new Error(message)
  },

  _handleHttpError(error) {
    const message = error.response?.data?.message || error.message || 'Error en la solicitud'
    return new Error(message)
  }
}
