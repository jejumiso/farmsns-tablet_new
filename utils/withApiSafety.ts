// src/utils/withApiSafety.ts
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/shared-types/apiResponse'
import axios from 'axios';
export async function withApiSafety<T>(
  request: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> {
  try {
    const res = await request();
    return res.data;
  } catch (error: any) {
    // AxiosError 이고, 서버가 보낸 응답(body)이 있으면 그대로 반환
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ApiResponse<T>;
    }

    // 그 외 예외는 generic 메시지
    return {
      isSuccess: false,
      message: '요청 중 오류가 발생했습니다.',
      error: error?.message ?? 'Unknown error',
    };
  }
}