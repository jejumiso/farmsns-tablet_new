// packages/shared/services/userService.ts
import type { ApiResponse } from '@/shared-types/apiResponse';
import { useApi } from '@/composables/useApi'
export function createAdministratorService() {
  const api = useApi() // ✅ 여기서 axios 인스턴스 생성


  return {
    async getAdministratorById(id: string): Promise<ApiResponse> {
      const response = await api.get(`/api/administrator/AdministratorByLogin/${id}`); // 단수형 엔드포인트로 변경
      return response.data as ApiResponse;
    },
    async createAdministrator(data: any): Promise<ApiResponse> {
      const response = await api.post(`/administrator`, data);
      return response.data as ApiResponse;
    },
  };
}
