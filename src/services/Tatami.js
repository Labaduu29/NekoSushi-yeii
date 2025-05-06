import api from '@/api';

export default {
  getTatamisDisponibles(fecha, hora, personas) {
    return api.get('/tatamis/disponibles', { params: { fecha, hora, personas } });
  },
  
};