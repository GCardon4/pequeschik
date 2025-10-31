export default [
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/public/HomePage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/public/LoginPage.vue') },

      {
        // Ruta Vista por producto //Publica
        path: 'product/:id',
        name: 'product-view',
        component: () => import('pages/public/ProductViewPage.vue'),
        props: true,
        meta: { title: 'Detalle Producto' },
      },

    ],
  },
];
