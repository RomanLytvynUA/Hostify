import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SetupView from './views/SetupView.vue'
import GameView from './views/GameView.vue'
import ResultsView from './views/ResultsView.vue'
import GrammarView from './views/GrammarView.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
    {
      path: '/results',
      name: 'results',
      component: ResultsView
    },
    {
      path: '/grammar',
      name: 'grammar',
      component: GrammarView
    },
  ]
})

export default router
