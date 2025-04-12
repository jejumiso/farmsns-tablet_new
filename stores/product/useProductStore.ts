// stores/product/useProductStore.ts
import type { Product } from '@/shared-types/product/product'
import { createProductService } from '@/services/product/productService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { defineStore } from 'pinia'
import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'
import type { ApiResponse } from '@/shared-types/apiResponse'

const ERROR_MESSAGE = {
  noCompany: '회사 정보가 없습니다.',
  loadFailed: '상품 불러오기 실패',
  saveFailed: '상품 저장 실패',
  deleteFailed: '상품 삭제 실패',
}

export interface ProductState {
  products: Product[]
  dateLastFetched: number
  loading: boolean
  error: string | undefined  
  currentPage: number,           // 👉 페이징 대비
  scrollY: number,               // 👉 스크롤 위치 저장

}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    dateLastFetched: 0,
    loading: false,
    error: '',
    currentPage: 1,           // 👉 페이징 대비
    scrollY: 0,               // 👉 스크롤 위치 저장

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

    async syncWithServer(): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany }

      this.loading = true
      try {
        const now = Date.now()
        const oneDay = 1000 * 60 * 60 * 24
        const since = (now - this.dateLastFetched > oneDay) ? 0 : this.dateLastFetched

        const resDeleted = await createProductService().getDeleted(companyId)
        const deletedIds = resDeleted.isSuccess ? resDeleted.data ?? [] : []

        const resModified = await createProductService().getModified(companyId, since)
        if (!resModified.isSuccess) {
          this.error = resModified.message || ERROR_MESSAGE.loadFailed
          return { isSuccess: false, message: this.error }
        }

        const updatedProducts = resModified.data ?? []
        const filtered = this.products.filter(p => !deletedIds.includes(p.id))
        const merged = [
          ...filtered.filter(p => !updatedProducts.some(up => up.id === p.id)),
          ...updatedProducts
        ]

        this.products = merged
        this.dateLastFetched = now
        this.error = ''

        const versionCache = loadVersionCache()
        versionCache.productVersion = useAuthStore().currentCompany?.productVersion ?? null
        saveVersionCache(versionCache)

        return { isSuccess: true, data: this.products }
      } catch (e: any) {
        this.error = e.message || ERROR_MESSAGE.loadFailed
        return { isSuccess: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async saveProduct(product: Product): Promise<ApiResponse<{ id: string }>> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany }

      try {
        const res = await createProductService().save(companyId, product)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.saveFailed
          return { isSuccess: false, message: this.error }
        }

        this.error = ''
        return { isSuccess: true, data: res.data }
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.saveFailed
        return { isSuccess: false, message: this.error }
      }
    },

    async saveProducts(products: Product[]): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany }

      try {
        const res = await createProductService().saveMany(companyId, products)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.saveFailed
          return { isSuccess: false, message: this.error }
        }

        this.error = ''
        return { isSuccess: true }
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.saveFailed
        return { isSuccess: false, message: this.error }
      }
    },

    async deleteProduct(id: string): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany }

      try {
        const res = await createProductService().deleteItem(companyId, id)
        if (res.isSuccess) {
          this.products = this.products.filter(p => p.id !== id)
          return { isSuccess: true }
        } else {
          this.error = res.message || ERROR_MESSAGE.deleteFailed
          return { isSuccess: false, message: this.error }
        }
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.deleteFailed
        return { isSuccess: false, message: this.error }
      }
    }
  },

  persist: {
    key: 'product',
    storage: localStorage,
    paths: ['products', 'dateLastFetched'],
  },
})
