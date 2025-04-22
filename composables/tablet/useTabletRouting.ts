// // composables/useTabletRouting.ts
// import { watch } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth/useAuthStore'

// export function useTabletRouting() {
//   const authStore = useAuthStore()
//   const route = useRoute()
//   const router = useRouter()

//   // Flutter 연동 및 오디오 안내
//   watch(
//     () => authStore.tabletSettings.pendingRewardAmount,
//     (newValue) => {
//       if (newValue > 0 && window.FlutterChannel) {
//         window.FlutterChannel.postMessage(JSON.stringify({
//           action: 'playAudio',
//           fileName: 'phone_input_instruction',
//         }))
//       }
//     }
//   )

//   // 화면 이동 처리
//   watch(
//     () => authStore.tabletSettings.pendingRewardAmount,
//     (newValue, oldValue) => {
//       console.log('[TabletRouting] pendingRewardAmount changed:', { oldValue, newValue })

//       if (newValue === 0) {
//         if (authStore.tabletSettings.useStandbyScreen) {
//           router.push('/standby-screen')
//         } else if (authStore.tabletSettings.useRewardInputScreen) {
//           router.push('/reward-input-screen')
//         } else if (authStore.tabletSettings.usePhoneInputScreen) {
//           router.push('/phone-input-screen')
//         } else {
//           console.warn('[TabletRouting] No valid screen configuration found.')
//         }
//       } else if (newValue > 0) {
//         if (route.path !== '/phone-input-screen') {
//           router.push('/phone-input-screen')
//         }
//       } else {
//         console.warn('[TabletRouting] Invalid pendingRewardAmount value:', newValue)
//       }
//     },
//     { immediate: true }
//   )
// }
