// composables/useApi.ts

import { useCookie } from '#app'
import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.API_BASE_URL as string | undefined

  console.log('📡 axios baseURL:', baseURL); // 👈 이거 추가!


  const token = useCookie('token') // 클라이언트/서버 모두 가능

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : undefined,
    },
  })

  return instance
}
