import { useApi } from '@/composables/useApi';
import type { ApiResponse } from '@/shared-types/apiResponse';
import type { Category } from '@/shared-types/category/category';

export function createCategoryService() {
  const api = useApi();

  return {

    // ✅ 카테고리 추가 또는 수정
    async save(companyId: string, category: Category): Promise<ApiResponse> {
      const response = await api.post(`/api/category/${companyId}`, category);
      console.log('📡 save category:', companyId, category);
      return response.data as ApiResponse;
    },

    // ✅ 카테고리 삭제
    async delete(companyId: string, docId: string, categoryId: string): Promise<ApiResponse> {
      const response = await api.delete(`/api/category/${companyId}/${docId}/${categoryId}`);
      return response.data as ApiResponse;
    }
  };
}
