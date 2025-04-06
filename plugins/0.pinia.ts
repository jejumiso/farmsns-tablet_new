// // plugins/0.pinia.ts
// // ❌ 이 파일 전체를 삭제하거나 아래처럼 주석 처리하세요

// import { createPinia } from 'pinia'
// import { markRaw } from 'vue'
// import type { Router } from 'vue-router'

// export default defineNuxtPlugin((nuxtApp) => {
//   const pinia = createPinia()
//   pinia.use(() =>
//     ({
//       router: markRaw(nuxtApp.$router as Router),
//     } as unknown as void)
//   )
//   nuxtApp.vueApp.use(pinia)
// })


// // ❌ Nuxt 3에서는 createPinia()를 수동 등록하면 $pinia 충돌 오류 발생
// // → Nuxt가 @pinia/nuxt 모듈로 자동 등록하기 때문에 이 파일은 사용하지 않음
// // → 필요 시 이 파일은 삭제 가능. 참고용으로만 남겨둠.

// /**
//  * 📌 이 파일은 Nuxt 3 + @pinia/nuxt 조합에서는 필요하지 않습니다.
//  * Nuxt가 Pinia를 자동 등록하며, 수동 등록 시 $pinia 충돌이 발생합니다.
//  * → 안전을 위해 주석 처리하며, 추후 삭제 가능.
//  */