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
  };
}
