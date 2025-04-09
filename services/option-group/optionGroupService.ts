// services/option-group/optionGroupService.ts
import { useApi } from '@/composables/useApi';
import type { ApiResponse } from '@/shared-types/apiResponse';
import type { OptionGroup } from '@/shared-types/option/optionGroup';

export function createOptionGroupService() {
  const api = useApi();

  return {
    async getCompanyOptionGroups(companyId: string, dateLastFetched: number): Promise<ApiResponse> {
      const response = await api.get(`/api/option-groups/${companyId}`, {
        params: { since: dateLastFetched },
      });
      return response.data as ApiResponse;
    },

    async save(companyId: string, optionGroup: OptionGroup): Promise<ApiResponse> {
      const response = await api.post(`/api/option-group/${companyId}`, optionGroup);
      return response.data as ApiResponse;
    },
    async delete(companyId: string, docId: string, optionGroupId: string): Promise<ApiResponse> {
      console.log('📡 LOGGER - 삭제요청청'); // 👈 이거 추가!
      const response = await api.delete(`/api/option-group/${companyId}/${docId}/${optionGroupId}`);
      
      return response.data;
    }

  };
}
