// src/services/option/optionService.ts
import type { Option } from '@/shared-types/option/option'
import { createDocumentService } from '@/services/common/documentService'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createOptionService() {
  const documentService = createDocumentService<Option>('options')

  return {
    /**
     * 전체 옵션 조회
     */
    async getAll(companyId: string): Promise<ApiResponse<Option[]>> {
      return await documentService.getAll(companyId)
    },

    /**
     * 수정된 옵션만 조회 (since 기준)
     */
    async getModified(companyId: string, since: number): Promise<ApiResponse<Option[]>> {
      return await documentService.getAll(companyId, since)
    },

    /**
     * 단일 옵션 조회
     */
    async getById(companyId: string, itemId: string): Promise<ApiResponse<Option>> {
      return await documentService.getOne(companyId, itemId)
    },

    /**
     * 옵션 저장 (단일)
     */
    async save(companyId: string, option: Option): Promise<ApiResponse> {
      return await documentService.save(companyId, option)
    },

    /**
     * 옵션 저장 (복수)
     */
    async saveMany(companyId: string, options: Option[]): Promise<ApiResponse> {
      return await documentService.saveMany(companyId, options)
    },

    /**
     * 옵션 삭제
     */
    async deleteItem(companyId: string, optionId: string): Promise<ApiResponse> {
      return await documentService.deleteItem(companyId, optionId)
    },

    /**
     * 삭제된 옵션 ID 목록 조회
     */
    async getDeleted(companyId: string): Promise<ApiResponse<string[]>> {
      return await documentService.getDeleted(companyId)
    },
  }
}
