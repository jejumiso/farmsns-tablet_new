// packages/shared/services/company/companyService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse';
import { createDocumentService } from '../common/documentService';
import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections';
import type { Company } from '~/shared-types/company/company';


const documentService = createDocumentService<Company>(COLLECTION_PERMISSIONS.companies.name)

export function createAdministratorService() {
  return {
    async getAdministratorById(companyId: string) {
      return documentService.getOne('', companyId)
    },

    // 📌 필요한 함수가 더 생기면 여기에 추가
    // async getAllAdministrators(...) { ... }
    // async saveAdministrator(...) { ... }
  }
}



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
