// packages/shared/services/company/companyService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse';

export function createCompanyService() {
  const api = useApi() // ✅ 여기서 axios 인스턴스 생성
  return {
    async getCompanyById(id: string): Promise<ApiResponse> {
      const response = await api.get(`/api/company/${id}`); // 단수형 엔드포인트로 변경
      return response.data as ApiResponse;
    },
    async createAdministrator(data: any): Promise<ApiResponse> {
      const response = await api.post(`/administrator`, data);
      return response.data as ApiResponse;
    },
  };
}
