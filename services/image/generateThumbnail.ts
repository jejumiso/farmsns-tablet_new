import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

export async function generateThumbnail(
  companyId: string,
  imageType: 'company' | 'product',
  fileName: string
): Promise<ApiResponse<{ thumbnailFileName: string }>> {
  const api = useApi()
  return await api
    .post('/api/image/generate-thumbnail', {
      companyId,
      imageType,
      fileName,
    })
    .then(res => res.data)
}
