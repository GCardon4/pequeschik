import { useAuthStore } from 'src/stores/storeAuth'

export const authGuard = async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.user) {
    return next({ name: 'login' })
  }
  next()
}

export const roleGuard = (rolesPermitidos) => (to, from, next) => {
  const auth = useAuthStore()
  if (!rolesPermitidos.includes(auth.userRole)) {
    return next({ name: 'access-denied' })
  }
  next()
}

export const redirectIfLoggedIn = async (to, from, next) => {
  const auth = useAuthStore()
  if (auth.user) {
    await auth.loadProfile()
    if (auth.userRole === 'admin') {
      return next({ name: 'admin' })
    } else {
      return next({ name: 'home' })
    }
  }
  next()
}
