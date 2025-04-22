// composables/alimtalk/useAlimtalkTemplates.ts
import { createAlimtalkService } from '@/services/alimtalk/alimtalkService'
import { useAuthStore } from '@/stores/auth/useAuthStore'

export async function useAlimtalkTemplates() {
  const authStore = useAuthStore()
  const kakaoChannelId = authStore.company?.kakaoInfo?.kakaoChannelId

  if (!kakaoChannelId) {
    console.warn('[Alimtalk] kakaoChannelId가 없습니다.')
    return
  }

  try {
    const alimtalkService = createAlimtalkService()
    const response = await alimtalkService.getTemplatesByChannelId(kakaoChannelId)

    if (response.isSuccess && response.data) {
      authStore.kakaoAlimTemplate = response.data[0] // ✅ 첫 번째 템플릿을 기본으로 저장
      console.log('✅ 템플릿 불러오기 성공:', response.data[0])
    } else {
      console.warn('⚠️ 템플릿 불러오기 실패:', response.message)
    }
  } catch (err) {
    console.error('❌ useAlimtalkTemplates 오류:', err)
  }
}
