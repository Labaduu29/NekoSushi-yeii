import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes de cada "página"

import LayoutMain from '@/layouts/LayoutMain.vue';
import PagRestau from '@/pages/PagRestau.vue';
import ReservaForm from '@/pages/PagReserva.vue';
import LoginCliente from '@/components/LoginCliente.vue';
import MisReservas from '@/components/MisReservas.vue';




const routes = [
  { path: '/', component: LayoutMain, children: [
    {
      path: '',
      component: PagRestau,
    },
    {
      path: 'PagLogin',
      component: LoginCliente,
      
    },
    {
      path: 'PagReserva',
      component: ReservaForm,
      
    },
    {
      path: 'PagMisReservas',
      component: MisReservas,
      
    },
    
   
  ],}
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;