import api from '../Api/IndexApi'  // Ruta relativa correcta

export default {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
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
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error de autenticación'
    throw new Error(message)
  }
}