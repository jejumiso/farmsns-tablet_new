// composables/alimtalk/useAlimtalkTemplates.ts
import { createAlimtalkService } from '@/services/alimtalk/alimtalkService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { decryptWithIv } from '~/shared-utils/crypto/decryption'

export async function useAlimtalkTemplates() {
  const authStore = useAuthStore()
  const securedSenderKey = authStore.company?.kakaoInfo?.securedSenderKey

  if (!securedSenderKey) {
    console.warn('[Alimtalk] kakaoChannelId가 없습니다.')
    return
  }
  if (!authStore.company?.iv) {
    console.warn('[Alimtalk] iv가 없습니다.')
    return
  }
  
  const senderkey = decryptWithIv(securedSenderKey, authStore.company.iv)
  

  try {
    const alimtalkService = createAlimtalkService()
    const response = await alimtalkService.getTemplatesByChannelId(senderkey)

    if (response.isSuccess && response.data) {
      console.log('✅ 템플릿 불러오기 성공:', response.data)

      const targetCode = authStore.currentCompany?.kakaoInfo.noticeCodePurchaseStamp

      const matchedTemplate = response.data.find(
        (template) => template.templtCode === targetCode
      ) ?? null
      authStore.kakaoAlimTemplate = matchedTemplate

      if (!matchedTemplate) {
        console.warn('❌ 일치하는 템플릿이 없습니다. 테블릿 동작이 제한됩니다.')
      } else {
        console.log('✅ 일치하는 템플릿:', matchedTemplate)
      }



    } else {
      console.warn('⚠️ 템플릿 불러오기 실패:', response.message)
    }
  } catch (err) {
    console.error('❌ useAlimtalkTemplates 오류:', err)
  }
}
