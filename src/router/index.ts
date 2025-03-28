import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: () => import('../views/Overview.vue')
    },
    {
      path: '/players',
      name: 'Players',
      component: () => import('../views/Players.vue')
    },
    {
      path: '/content-library',
      name: 'ContentLibrary',
      component: () => import('../views/ContentLibrary.vue')
    },
    {
      path: '/playlists',
      name: 'Playlists',
      component: () => import('../views/Playlists.vue')
    },
    {
      path: '/layouts',
      name: 'Layouts',
      component: () => import('../views/Layouts.vue')
    },
    {
      path: '/schedules',
      name: 'Schedules',
      component: () => import('../views/Schedules.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/system',
      name: 'System',
      component: () => import('../views/System.vue')
    }
  ]
})

export default router
