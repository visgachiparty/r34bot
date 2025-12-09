import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/src/views/HomeView.vue'
import FavoritesView from '@/src/views/FavoritesView.vue'
import LikesView from '@/src/views/LikesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/likes',
      name: 'likes',
      component: LikesView,
    },
  ],
})

export default router
