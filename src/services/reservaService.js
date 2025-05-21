import api from '@/Api/IndexApi'

export default {
  /**
   * Crea una nueva reserva.
   * @param {Object} reservationData - Datos de la reserva (fecha, hora, personas, etc).
   * @returns {Promise<Object>} - Detalles de la reserva creada.
   */
  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  /**
   * Obtiene las reservas de un usuario.
   * @param {string|number} userId - ID del usuario.
   * @returns {Promise<Array>} - Lista de reservas del usuario.
   */
  async getUserReservations(userId) {
    try {
      const response = await api.get(`/reservations/user/${userId}`)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  /**
   * Cancela una reserva.
   * @param {string|number} reservationId - ID de la reserva a cancelar.
   * @returns {Promise<Object>} - Detalle de la reserva cancelada.
   */
  async cancelReservation(reservationId) {
    try {
      const response = await api.delete(`/reservations/${reservationId}`)
      return response.data
    } catch (error) {
      throw this._handleReservationError(error)
    }
  },

  /**
   * Manejo centralizado de errores de reserva.
   * @param {Object} error - Error de Axios.
   * @returns {Error} - Error procesado con mensaje claro.
   */
  _handleReservationError(error) {
    const status = error.response?.status
    let message = 'Error en la reserva'

    if (status === 401) message = 'No autorizado - Por favor inicia sesión.'
    else if (status === 404) message = 'Reserva no encontrada.'
    else if (status === 409) message = 'Conflicto - La reserva ya existe.'
    else if (error.response?.data?.message) message = error.response.data.message

    // Lanzar SIEMPRE el error para que el frontend pueda capturarlo con try/catch
    throw new Error(message)
  }
}