import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SetupView from './views/SetupView.vue'
import GameView from './views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
  ]
})

export default router
