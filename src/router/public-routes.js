export default [
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/public/HomePage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/public/LoginPage.vue'), beforeEnter: [(to, from, next) => import('../router/guards').then(m => m.redirectIfLoggedIn(to, from, next))] },
    ],
  },
]
