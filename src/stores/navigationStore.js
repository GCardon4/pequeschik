import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    adminLinks: [
      {
        title: 'Dashboard',
        caption: 'Vista general',
        icon: 'dashboard',
        routeName: 'admin-dashboard',
      },
      {
        title: 'Productos',
        caption: 'Gestión de productos',
        icon: 'shopping_bag',
        routeName: 'product-list',
      },
      {
        title: 'Usuarios',
        caption: 'Gestión de usuarios',
        icon: 'people',
        routeName: 'user-list',
      },
    ],
  }),

  getters: {
    getAdminLinks: (state) => state.adminLinks,
  },
})
