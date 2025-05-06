const TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'
const EXPIRATION_KEY = 'token_expiration'

export default {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  setUserData(userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  },

  getUserData() {
    const data = localStorage.getItem(USER_DATA_KEY)
    return data ? JSON.parse(data) : null
  },

  removeUserData() {
    localStorage.removeItem(USER_DATA_KEY)
  },

  setExpiration(expiration) {
    localStorage.setItem(EXPIRATION_KEY, expiration)
  },

  getExpiration() {
    return localStorage.getItem(EXPIRATION_KEY)
  },

  removeExpiration() {
    localStorage.removeItem(EXPIRATION_KEY)
  },

  clearAll() {
    this.removeToken()
    this.removeUserData()
    this.removeExpiration()
  }
}