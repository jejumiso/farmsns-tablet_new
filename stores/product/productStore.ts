import type { Product, ProductState } from '@/shared-types/product/product'
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta'
import { createProductService } from '@/services/product/productService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { defineStore } from 'pinia'
import type { ApiResponse } from '~/shared-types/apiResponse'
import { filterRemainingItems } from '@/utils/firestoreMerge'

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

    async fetchProductsIfChanged() {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      this.loading = true
      try {
        const storedProducts = this.products
        const res = await createProductService().getAll(companyId, this.dateLastFetched)
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.loadFailed
          return
        }

        const fetchedProducts = res.data!.items
        const fetchedDocuments = res.data!.documents

        const finalProducts = filterRemainingItems(
          storedProducts,
          fetchedProducts,
          fetchedDocuments,
          product => product.docId
        )
        finalProducts.push(...fetchedProducts)

        this.products = finalProducts
        this.documents = fetchedDocuments
        this.dateLastFetched = Date.now()
        this.error = null // ✅ 성공 시 에러 초기화
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.loadFailed
      } finally {
        this.loading = false
      }
    },

    async saveProduct(product: Product) {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      try {
        
        const res = await createProductService().save(companyId, product)
        console.log('✅ ✅ Saving product: 1', JSON.stringify(res))
        if (!res.isSuccess) {
          this.error = res.message || ERROR_MESSAGE.saveFailed
          return
        }

        this.error = null // ✅ 성공 시 에러 초기화
        await this.fetchProductsIfChanged()
      } catch (err: any) {
        console.log('✅ ✅ Saving product: 2', JSON.stringify(err))
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

        this.error = null // ✅ 성공 시 에러 초기화
        await this.fetchProductsIfChanged()
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

        this.error = null // ✅ 성공 시 에러 초기화
        await this.fetchProductsIfChanged()
      } catch (err: any) {
        this.error = err?.message || ERROR_MESSAGE.deleteFailed
      }
    },

    async refreshProducts() {
      await this.fetchProductsIfChanged()
    },
  },

  persist: {
    key: 'product',
    storage: localStorage,
    paths: ['products', 'documents'],
  },
})
