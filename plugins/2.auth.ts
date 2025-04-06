import { useAuthStore } from '@/stores/auth/useAuthStore'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Auth plugin initialized'); // 디버깅 로그 추가
  const authStore = useAuthStore();
  console.log('Auth store state:', authStore.$state); // 상태 확인
});
