// src/services/common/documentService.ts
import type { BaseDocument } from '@/shared-types/common/documentMeta'
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

import { withApiSafety } from '@/utils/withApiSafety'
import type { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'

export function createDocumentService<T>(collectionKey: keyof typeof COLLECTION_PERMISSIONS) {

  return {
    async getOne(companyId: string, itemId: string): Promise<ApiResponse<T>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T>>(
          `api/document/admin/${collectionKey}/${itemId}`,
          { params: { companyId } }
        )
      )
    },

    async getAll(companyId: string, since?: number): Promise<ApiResponse<T[]>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T[]>>(
          `api/document/admin/${collectionKey}`,
          {
            params: {
              companyId,
              ...(since ? { since } : {}),
            },
          }
        )
      )
    },

    async save(companyId: string, item: T): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(
          `api/document/admin/${collectionKey}`,
          { companyId, item }
        )
      )
    },

    async saveMany(companyId: string, items: T[]): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(
          `api/document/admin/${collectionKey}/saveMany`,
          { companyId, items }
        )
      )
    },

    async deleteItem(companyId: string, itemId: string): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().delete<ApiResponse>(
          `api/document/admin/${collectionKey}/delete`,
          {
            params: {
              companyId,
              itemId,
            },
          }
        )
      )
    },
    
    // src/services/product/productService.ts
    async getDeleted(companyId: string): Promise<ApiResponse<string[]>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<string[]>>(
          `api/document/admin/${collectionKey}/deleted`, // ✅ 여기가 동적
          {
            params: { companyId }
          }
        )
      )
    }
    

  }
}

