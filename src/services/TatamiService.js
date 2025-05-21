import api from '@/Api/IndexApi'

export default {
  /**
   * Obtiene la lista de tatamis (con su estado de reserva).
   * @returns {Promise<Array>} - Lista de tatamis.
   */
  async getTatamis() {
    try {
      const response = await api.get('/tatamis')
      return response.data
    } catch (error) {
      throw this._handleTatamiError(error)
    }
  },

  /**
   * Cambia el estado de reservado de un tatami (por ejemplo, cuando se reserva o libera).
   * @param {string|number} tatamiId - ID del tatami.
   * @param {boolean} reservado - Nuevo estado de reserva.
   * @returns {Promise<Object>} - Tatami actualizado.
   */
  async setTatamiReservado(tatamiId, reservado) {
    try {
      const response = await api.patch(`/tatamis/${tatamiId}`, { reservada: reservado })
      return response.data
    } catch (error) {
      throw this._handleTatamiError(error)
    }
  },

  /**
   * (Opcional) Crear un nuevo tatami.
   */
  async createTatami(tatamiData) {
    try {
      const response = await api.post('/tatamis', tatamiData)
      return response.data
    } catch (error) {
      throw this._handleTatamiError(error)
    }
  },

  /**
   * Manejo centralizado de errores de tatami.
   * @param {Object} error - Error de Axios.
   * @returns {Error}
   */
  _handleTatamiError(error) {
    const status = error.response?.status
    let message = 'Error al gestionar tatamis.'

    if (status === 401) message = 'No autorizado - Por favor inicia sesión.'
    else if (status === 404) message = 'Tatami no encontrado.'
    else if (status === 409) message = 'Conflicto - El tatami ya está reservado.'
    else if (error.response?.data?.message) message = error.response.data.message

    throw new Error(message)
  }
}