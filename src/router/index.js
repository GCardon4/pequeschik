import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '../router/public-routes'
import adminRoutes from '../router/admin-routes'
import { authGuard, roleGuard } from './guards'

export default route(function () {
  const routes = [
    ...publicRoutes,
    {
      path: '/admin',
      component: () => import('layouts/AdminLayout.vue'),
      beforeEnter: [authGuard, roleGuard(['admin'])],
      children: adminRoutes,
    },
    { path: '/:catchAll(.*)*', component: () => import('pages/errors/NotFoundPage.vue') },
  ]

  const Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  })

  return Router
})
