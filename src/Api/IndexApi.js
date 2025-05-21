import axios from 'axios'
import authService from '@/services/authService'
import router from '@/router'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000', // Cambia a la URL de tu backend real si es necesario
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor de solicitud
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    if (authService._isTokenExpired()) {
      try {
        await authService.refreshToken()
        config.headers.Authorization = `Bearer ${localStorage.getItem('auth_token')}`
      } catch (error) {
        authService.logout()
        router.push('/login')
        return Promise.reject(error)
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// Interceptor de respuesta
api.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        authService.logout()
        router.push('/login')
        break
      case 403:
        router.push('/forbidden')
        break
      case 500:
        error.message = 'Error interno del servidor'
        break
    }
  }

  return Promise.reject(error)
})

export default api