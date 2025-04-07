// packages/shared/services/product/productService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse';
import type { Product  } from '@/shared-types/product/product';

export function createProductService() {
  const api = useApi() // ✅ 여기서 axios 인스턴스 생성
  return {
    async getCompanyProducts(companyId: string, dateLastFetched:number): Promise<ApiResponse> {
      // const response = await api.get(`/api/products/${companyId}`); // 단수형 엔드포인트로 변경
      const response = await api.get(`/api/products/${companyId}`, {
        params: { since: dateLastFetched } // ✅ 서버는 since로 받음
      });
      return response.data as ApiResponse;
    },
    async create(companyId: string, product: Product ): Promise<ApiResponse> {
       const response =  await api.post(`/api/companies/${companyId}/products`, product);
       return response.data as ApiResponse;
      },
      async update(companyId: string, productId: string, product: Product): Promise<ApiResponse> {
        const response = await api.put(`/api/companies/${companyId}/products/${productId}`, product)
        return response.data as ApiResponse
      }
    }
}
