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
      // Aquí se pueden añadir más enlaces para el administrador
    ],
  }),

  getters: {
    getAdminLinks: (state) => state.adminLinks,
  },
})
