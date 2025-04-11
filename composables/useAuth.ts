// composable/useAuth.ts
import { useCookie, useNuxtApp } from '#app'
export const useAuth = () => {
    const { $authService } = useNuxtApp()
  
    const loginWithSms = async (phone: string, code: string) => {
      const user = await $authService.verifySms(phone, code)
      const token = await user?.getIdToken()
      if (token) {
        useCookie('token', { maxAge: 60 * 60 * 24 }).value = token
      }
      return user
    }
  
    return {
      loginWithSms,
      logout: $authService.logout,
    }
  }
  