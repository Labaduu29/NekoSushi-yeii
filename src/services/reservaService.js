import api from '@/api'

export default {
  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  async getUserReservations(userId) {
    try {
      const response = await api.get(`/reservations/user/${userId}`)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  async cancelReservation(reservationId) {
    try {
      const response = await api.delete(`/reservations/${reservationId}`)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  _handleReservationError(error) {
    const status = error.response?.status
    let message = 'Error en la reserva'

    if (status === 401) message = 'No autorizado - Por favor inicie sesión'
    if (status === 404) message = 'Reserva no encontrada'
    if (status === 409) message = 'Conflicto - La reserva ya existe'

    return new Error(error.response?.data?.message || message)
  }
}