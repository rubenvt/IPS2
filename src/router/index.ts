import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Players from '../views/Players.vue'
import Playlists from '../views/Playlists.vue'
import Layouts from '../views/Layouts.vue'
import ContentLibrary from '../views/ContentLibrary.vue'
import Schedules from '../views/Schedules.vue'
import Reports from '../views/Reports.vue'
import System from '../views/System.vue'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/players',
    name: 'Players',
    component: Players
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: Playlists
  },
  {
    path: '/layouts',
    name: 'Layouts',
    component: Layouts
  },
  {
    path: '/content-library',
    name: 'ContentLibrary',
    component: ContentLibrary
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: Schedules
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports
  },
  {
    path: '/system',
    name: 'System',
    component: System
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
