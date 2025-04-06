// 루트 디렉토리 globals.d.ts
export {}

declare global {
  interface Window {
    recaptchaVerifier?: any;
    FlutterChannel?: {
      postMessage: (message: string) => void; // postMessage 메서드 정의
    };
  }

  const defineNuxtPlugin: typeof import('#app')['defineNuxtPlugin'];
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig'];
}
