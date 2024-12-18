import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CycleView from '@/views/CycleView.vue'
import EnigmaRequestView from '@/views/EnigmaRequestView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cycles',
    name: 'cycles',
    component: CycleView
  },
  {
    path: '/enigma',
    name: 'enigma',
    component: EnigmaRequestView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
