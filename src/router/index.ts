import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SquareControlView from '@/views/SquareControlView.vue';

const router = createRouter({
   history: createWebHashHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         component: HomeView,
      },
      {
         path: '/square-control',
         name: 'square-control',
         component: SquareControlView,
      },
   ],
});

export default router;
