import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes de cada "página"

import LayoutMain from '@/layouts/LayoutMain.vue';
import PagRestau from '@/pages/PagRestau.vue';
import ReservaForm from '@/pages/PagReserva.vue';




const routes = [
  { path: '/', component: LayoutMain, children: [
    {
      path: '',
      component: PagRestau,
    },
    {
      path: 'PagReserva',
      component: ReservaForm,
      
    },
   
  ],}
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
