import { useAuthStore } from '~/stores/auth/useAuthStore'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // ✅ Firebase Auth 초기화가 안 되어 있다면 기다림
  if (!authStore.initialized) {
    console.log('[middleware] Waiting for Firebase Auth initialization...')
    await authStore.initializeAuth()
  }

  const currentUser = authStore.currentUser
  const path = to.path

  if (path.startsWith('/tablet')) {
    const onlyForGuests = ['/tablet/login']
    const accessibleByAll = ['/tablet/login', '/tablet/guest', '/tablet/guest2']

    if (currentUser && onlyForGuests.includes(path)) {
      return navigateTo('/tablet')
    }

    if (!currentUser && !accessibleByAll.includes(path)) {
      return navigateTo('/tablet/login')
    }
  }
})
