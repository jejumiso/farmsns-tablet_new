// packages/shared/services/userService.ts
import type { ApiResponse } from '@/shared-types/apiResponse';
import { useApi } from '@/composables/useApi'
import { createDocumentService } from '../common/documentService';
import { COLLECTION_PERMISSIONS } from '@/shared-constants/collections';
import type { Administrator } from '~/shared-types/administrator/administrator';
const documentService = createDocumentService<Administrator>(COLLECTION_PERMISSIONS.administrators.name)

export function createAdministratorService() {
  return {
    async getAdministratorById(adminId: string) {
      return documentService.getOne('', adminId)
    },

    // 📌 필요한 함수가 더 생기면 여기에 추가
    // async getAllAdministrators(...) { ... }
    // async saveAdministrator(...) { ... }
  }
}