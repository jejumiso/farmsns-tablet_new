// services/alimtalk/alimtalkService.ts
import { useApi } from '@/composables/useApi'
import { withApiSafety } from '@/utils/withApiSafety'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { KakaoAlimTemplate } from '~/shared-types/kakao/templateResponse'

export function createAlimtalkService() {
  const api = useApi()

  return {
    /**
     * 템플릿 목록 조회 - 서버를 통해 알리고와 연동
     * @param channelId 알리고 채널 ID
     */
    async getTemplatesByChannelId(channelId: string): Promise<ApiResponse<KakaoAlimTemplate[]>> {
      return withApiSafety(() =>
        api.post<ApiResponse<KakaoAlimTemplate[]>>('/api/aligo/templateList', {
          kakaoChannelId: channelId, // 서버가 기대하는 필드명에 맞추세요
        })
      )
    },
  }
}
