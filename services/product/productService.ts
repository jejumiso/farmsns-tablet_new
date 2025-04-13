// src/services/product/productService.ts
import type { Product } from '@/shared-types/product/product'
import { createDocumentService } from '@/services/common/documentService'

export function createProductService() {
  const documentService = createDocumentService<Product>('product')

  return {
    /**
     * 전체 상품 조회
     */
    async getAll(companyId: string) {
        return  await documentService.getAll(companyId)

    },

    /**
     * 수정된 상품만 조회 (since 기준)
     */
    async getModified(companyId: string, since: number) {
        return  await documentService.getAll(companyId,since)

    },

    /**
     * 단일 상품 조회
     */
    async getById(companyId: string, itemId: string) {
      return await documentService.getOne(companyId, itemId)

    },

    /**
     * 상품 저장 (단일)
     */
    async save(companyId: string, product: Product) {
      return await documentService.save(companyId, product)
    },

    /**
     * 상품 저장 (복수)
     */
    async saveMany(companyId: string, products: Product[]) {
      return await documentService.saveMany(companyId, products)
    },

    /**
     * 상품 삭제
     */
    async deleteItem(companyId: string, itemId: string) {
      return await documentService.deleteItem(companyId, itemId)
    },

    /**
     * 상품 삭제 문서(단일문서임)
     */
    // ✅ 삭제된 상품 ID 목록 조회
    async getDeleted(companyId: string) {
      return await documentService.getDeleted(companyId)
    },
  }
}
