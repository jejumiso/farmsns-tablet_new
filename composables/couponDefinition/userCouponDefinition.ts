// composables/alimtalk/useAlimtalkTemplates.ts
import { createAlimtalkService } from '@/services/alimtalk/alimtalkService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createCouponDefinitionService } from '~/services/couponDefinition/couponDefinitionService'
import type { CouponDefinition } from '~/shared-types/coupon/couponDefinition'

export async function useCouponDefinition() {
  const authStore = useAuthStore()
  const companyId = authStore.company?.id

  if (!companyId) {
    console.warn('companyId 없습니다.')
    return
  }

  try {
    const couponService = createCouponDefinitionService('v2_companies', companyId, 'v2_couponDefinitions', 'admin');
    const response = await couponService.getAll(companyId)

    if (response.isSuccess && response.data) {
      console.log('✅ ~템플릿 불러오기 성공:', response.data)
      authStore.couponDefinition = response.data as CouponDefinition[]
      console.log('✅ ~쿠폰 정의:', authStore.couponDefinition)


    } else {
      console.warn('⚠️ 템플릿 불러오기 실패:', response.message)
    }
  } catch (err) {
    console.error('❌ useAlimtalkTemplates 오류:', err)
  }
}
