import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'

// Install router guards for authentication and authorization globally
export function installGuards(router) {
  router.beforeEach((to) => {
    // Access stores
    const auth = useAuthStore()
    const toast = useToastStore()

    // Route meta fields
    const isPublic = Boolean(to.meta.public)
    const requiresAuth = Boolean(to.meta.requiresAuth)
    const roles = to.meta.roles || []

    // Redirect authenticated users away from public pages
    if (
      isPublic &&
      auth.isAuthenticated &&
      (to.name === 'login' || to.name === 'auth')
    ) {
      return { name: 'products' }
    }

    // Redirect unauthenticated users to login page 
    if (requiresAuth && !auth.isAuthenticated) {
      return {
        name: 'login',
        query: { next: to.fullPath },
      }
    }

    // Role-based access control
    if (roles.length > 0) {
      const allowed = roles.includes(auth.user?.role)

      if (!allowed) {
        toast.error('Access denied')
        return { name: 'products' }
      }
    }

    return true
  })
}
