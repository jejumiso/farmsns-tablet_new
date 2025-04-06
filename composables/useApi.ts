import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token') // 클라이언트/서버 모두 가능

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 10000,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : undefined,
    },
  })

  return instance
}
