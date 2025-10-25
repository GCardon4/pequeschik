export default [
  {
    path: '',
    name: 'admin-dashboard',
    component: () => import('pages/admin/DashboardPage.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      role: 'admin',
    },
  },

  // 🛍️ CRUD Productos
  /*{
    path: 'products',
    name: 'product-list',
    component: () => import('pages/admin/products/ProductListPage.vue'),
    meta: { title: 'Productos', requiresAuth: true, role: 'admin' },
  },
  {
    path: 'products/create',
    name: 'product-create',
    component: () => import('pages/admin/products/ProductCreatePage.vue'),
    meta: { title: 'Nuevo Producto', requiresAuth: true, role: 'admin' },
  },
  {
    path: 'products/:id/edit',
    name: 'product-edit',
    component: () => import('pages/admin/products/ProductEditPage.vue'),
    props: true,
    meta: { title: 'Editar Producto', requiresAuth: true, role: 'admin' },
  },
  {
    path: 'products/:id',
    name: 'product-view',
    component: () => import('pages/admin/products/ProductViewPage.vue'),
    props: true,
    meta: { title: 'Detalle Producto', requiresAuth: true, role: 'admin' },
  },

  // 👥 CRUD Usuarios
  {
    path: 'users',
    name: 'user-list',
    component: () => import('pages/admin/users/UserListPage.vue'),
    meta: { title: 'Usuarios', requiresAuth: true, role: 'admin' },
  },
  {
    path: 'users/create',
    name: 'user-create',
    component: () => import('pages/admin/users/UserCreatePage.vue'),
    meta: { title: 'Nuevo Usuario', requiresAuth: true, role: 'admin' },
  },
  {
    path: 'users/:id/edit',
    name: 'user-edit',
    component: () => import('pages/admin/users/UserEditPage.vue'),
    props: true,
    meta: { title: 'Editar Usuario', requiresAuth: true, role: 'admin' },
  },

  // ⚙️ Roles y Configuración
  {
    path: 'roles',
    name: 'role-management',
    component: () => import('pages/admin/settings/RoleManagementPage.vue'),
    meta: { title: 'Gestión de Roles', requiresAuth: true, role: 'admin' },
  },

  // 🚫 Página de acceso denegado
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('pages/errors/AccessDeniedPage.vue'),
    meta: { title: 'Acceso Denegado' },
  },   */
]
