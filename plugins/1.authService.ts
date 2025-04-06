// plugins/1.authService.ts
import { createAuthService } from '@/services/auth/authService';
// import { setBaseURL } from '@myshared/shared/services/http';
import { initializeFirebase } from '@/services/firebaseService';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // ✅ 디버깅 로그
  console.log('🛠️ Nuxt Plugin 초기화 중...');
  console.log('🌐 API_BASE_URL:', config.public.API_BASE_URL);
  console.log('🔥 Firebase 설정값:');
  console.log('   🔑 apiKey:', config.public.FIREBASE_API_KEY);
  console.log('   🌍 authDomain:', config.public.FIREBASE_AUTH_DOMAIN);
  console.log('   🏷️ projectId:', config.public.FIREBASE_PROJECT_ID);
  console.log('   📦 appId:', config.public.FIREBASE_APP_ID);  

  // 디버깅 로그 추가
  console.log('Runtime Config (public):', config.public);

  // baseURL 설정
  // setBaseURL(config.public.API_BASE_URL as string);

  // Firebase 초기화
  initializeFirebase({
    apiKey: config.public.FIREBASE_API_KEY as string,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
    projectId: config.public.FIREBASE_PROJECT_ID as string,
    appId: config.public.FIREBASE_APP_ID as string,
  });

  const authService = createAuthService();

  return {
    provide: {
      authService,
    },
  };
});
