import type { Product, ProductState } from '@/shared-types/product/product'
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta'
import { createProductService } from '@/services/product/productService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { defineStore } from 'pinia'
import type { ApiResponse } from '~/shared-types/apiResponse'
import { filterRemainingItems } from '@/utils/firestoreMerge'
import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'

const ERROR_MESSAGE = {
  noCompany: '회사 정보가 없습니다.',
  loadFailed: '상품 불러오기 실패',
  saveFailed: '상품 저장 실패',
  deleteFailed: '상품 삭제 실패',
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    documents: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    getCompanyIdOrError(): string | null {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId) {
        this.error = ERROR_MESSAGE.noCompany
        return null
      }
      return companyId
    },



    async syncWithServer() {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      this.loading = true
      try {
        // 1. 삭제된 ID 목록 조회
        const resDeleted = await createProductService().getDeleted(companyId)
        const deletedIds = resDeleted.isSuccess ? resDeleted.data ?? [] : []

        // 2. 수정된 데이터 조회
        const since = this.dateLastFetched
        const resModified = await createProductService().getModified(companyId, since)
        const updatedProducts = resModified.isSuccess ? (resModified.data ?? []) : []

        // 3. 기존 products에서 삭제 목록 제거
        const productMap = new Map(this.products.map(p => [p.id, p]))
        for (const id of deletedIds) {
          productMap.delete(id)
        }

        // 4. 수정된 항목 덮어쓰기
        for (const product of updatedProducts) {
          productMap.set(product.id, product)
        }

        // 5. 갱신
        this.products = Array.from(productMap.values())
        this.dateLastFetched = Date.now()
        this.error = null

        // 6. 버전 캐시 갱신
        const versionCache = loadVersionCache()
        versionCache.productVersion = useAuthStore().currentCompany?.productVersion ?? null
        saveVersionCache(versionCache)

      } catch (e: any) {
        console.error('📛 syncWithServer 실패:', e)
        this.error = e.message || ERROR_MESSAGE.loadFailed
      } finally {
        this.loading = false
      }
    },

    async saveProduct(product: Product) {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      try {
        const res = await createProductService().save(companyId, product)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.saveFailed
          return
        }

        this.error = null
        // await this.fetchProductsIfChanged()
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.saveFailed
      }
    },

    async saveProducts(products: Product[]) {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      try {
        const res = await createProductService().saveMany(companyId, products)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.saveFailed
          return
        }

        this.error = null
        // await this.fetchProductsIfChanged()
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.saveFailed
      }
    },

    async deleteProduct(productId: string) {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      try {
        const res = await createProductService().deleteItem(companyId, productId)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.deleteFailed
          return
        }

        this.error = null
        // await this.fetchProductsIfChanged()
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.deleteFailed
      }
    },

    // async refreshProducts() {
    //   await this.fetchProductsIfChanged()
    // },
  },

  persist: {
    key: 'product',
    storage: localStorage,
    paths: ['products', 'documents'],
  },
})
