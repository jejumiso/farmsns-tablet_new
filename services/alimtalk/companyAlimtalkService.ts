// 📁 services/alimtalk/companyAlimtalkService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '~/shared-types/apiResponse'
import type { SendDeliveryStartPayload } from '@/shared-types/kakao/sendDeliveryStartPayload'

export function createCompanyAlimtalkService() {
  const api = useApi()

  return {
    /**
     * 배송 시작 알림톡 전송
     * @param payload 회사 ID, 관리자 ID, 템플릿 코드 및 전송 데이터
     */
    async sendDeliveryStartAlimtalk(
      payload: SendDeliveryStartPayload
    ): Promise<ApiResponse> {
      const response = await api.post('/api/alimtalk/send-invoice', payload)
      console.log('✅ 배송 시작 알림톡 전송 성공:', response.data)
      return response.data
    }
  }
}
