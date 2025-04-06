// types/pinia.d.ts
export {}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    pinia?: {
      autoImports?: string[]
    }
  }

  interface PublicRuntimeConfig {
    // 여기에 공개 환경변수 타입도 확장 가능
  }
}
