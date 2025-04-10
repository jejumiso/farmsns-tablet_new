// src/services/common/documentService.ts
import type { BaseDocument } from '@/shared-types/common/documentMeta'
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createDocumentService<T>(collectionName: string) {
  return {
    async getAll(companyId: string, since: number) : Promise<ApiResponse<{
      documents: BaseDocument<T>[],
      items: T[]
    }>> {
      const res = await useApi().get<ApiResponse<{
        documents: BaseDocument<T>[],
        items: T[]
      }>>(`api/document/${collectionName}?companyId=${companyId}&since=${since}`);
      return res.data;
    },

    async save(companyId: string, item: T) {
      const res = await useApi().post<ApiResponse>(
        `api/document/${collectionName}`,
        { companyId, item }
      );
      return res.data;
    },
    async saveMany(companyId: string, items: T[]) {
      const res = await useApi().post<ApiResponse>(
        `api/document/${collectionName}/saveMany`,
        { companyId, items }
      );
      return res.data;
    },
    async deleteItem(companyId: string, itemId: string) {
      const res = await useApi().delete<ApiResponse>(
        `api/document/${collectionName}/delete`,
        {
          params: {
            companyId,
            itemId,
          },
        }
      );
      return res.data;
    }
  };
}
