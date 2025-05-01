import api from '@/api';

export default {
  getMisReservas() {
    return api.get('/reservas/mis-reservas');
  },
  crearReserva(data) {
    return api.post('/reservas', data);
  },

};