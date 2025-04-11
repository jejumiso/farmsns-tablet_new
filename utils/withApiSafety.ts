// src/utils/withApiSafety.ts
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/shared-types/apiResponse'
export async function withApiSafety<T>(
  request: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> {
  try {
    const res = await request()
    return res.data
  } catch (error: any) {
    return {
      isSuccess: false,
      message: '요청 중 오류가 발생했습니다.',
      error: error?.message ?? 'Unknown error',
    }
  }
}
