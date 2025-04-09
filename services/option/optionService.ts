import { useApi } from '@/composables/useApi';
import type { ApiResponse } from '@/shared-types/apiResponse';
import type { Option } from '@/shared-types/option/option';

export function createOptionService() {
  const api = useApi();

  return {
    async getCompanyOptions(companyId: string, since: number): Promise<ApiResponse> {
      const response = await api.get(`/api/options/${companyId}`, {
        params: { since },
      });
      return response.data as ApiResponse;
    },

    async save(companyId: string, option: Option): Promise<ApiResponse> {
      const response = await api.post(`/api/option/${companyId}`, option);
      console.log('📡 save 👈',companyId); 
      console.log('📡 Option data:', option); 

      console.log('📡 Response data:', response.data); 
      return response.data as ApiResponse;
    }
  };
}
