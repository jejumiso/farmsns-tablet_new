// service/image/uploadImage.ts
import type { ApiResponse } from '~/shared-types/apiResponse'
import { useApi } from '@/composables/useApi'


interface UploadedImageResponse {
  url: string
  fileName: string
}

export async function uploadImage(blob: Blob, companyId: string, imageType: 'company' | 'product'): Promise<ApiResponse<UploadedImageResponse>> {
  const api = useApi()
  const formData = new FormData()

  const file = new File([blob], 'upload.jpg', { type: blob.type })
  formData.append('image', file)
  formData.append('companyId', companyId)
  formData.append('imageType', imageType)


  try {
    const res = await api.post<ApiResponse<UploadedImageResponse>>(
      '/api/image/upload-image',
      formData
    )

    return res.data
  } catch (err: any) {
    console.error('이미지 업로드 실패:', err)
    return {
      isSuccess: false,
      statusCode: err.response?.status ?? 500,
      message: '이미지 업로드 실패',
      error: err.message,
    }
  }
}

// $ curl -v -X POST http://127.0.0.1:5001/farmsns-main-test/asia-northeast3/api/api/image/upload-image   -F "image=@/c/users/h/a.jpg"
