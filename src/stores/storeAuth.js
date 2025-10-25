import { defineStore } from 'pinia'
import { supabase } from 'src/config/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
  }),

  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
      await this.loadProfile()
    },

    async loadProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', this.user.id)
        .single()
      if (error) throw error
      this.profile = data
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },

    get userRole() {
      return this.profile?.role || 'guest'
    },
  },
})