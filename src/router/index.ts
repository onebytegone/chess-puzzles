import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LevelView from '../views/LevelView.vue';
import AboutView from '../views/AboutView.vue';

const router = createRouter({
   history: createWebHashHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         component: HomeView,
      },
      {
         path: '/about',
         name: 'about',
         component: AboutView,
      },
      {
         path: '/level/:levelID',
         name: 'level',
         component: LevelView,
         props: true,
      },
      {
         path: '/:pathMatch(.*)*',
         name: 'not-found',
         redirect: '/',
      },
   ],
});

export default router;
