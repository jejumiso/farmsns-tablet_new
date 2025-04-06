// src/stores/product/productStore.ts
import type { Product ,ProductState} from '@/shared-types/product/product'
import type { DocumentMeta } from '@/shared-types/common/documentMeta'
import { createProductService } from '@/services/product/productService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { defineStore } from 'pinia'


export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    documents: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProductsIfChanged() {
      const authStore = useAuthStore()
      const companyId = authStore.currentCompany?.id || ''
      if (!companyId) {
        this.error = '회사 정보가 없습니다.'
        return
      }

      this.loading = true
      try {
        const res = await createProductService().getProductsByCompanyId(companyId)
        const { products, documents } = res.data as {
          products: Product[]
          documents: DocumentMeta[]
        }

        // 수정된 문서만 필터링
        const updatedDocs = documents.filter(doc => {
          const localDoc = this.documents.find(d => d.id === doc.id)
          return !localDoc || localDoc.dateModified < doc.dateModified
        })

        if (updatedDocs.length === 0) return // 변경 없음

        // 기존 상품 중 수정되지 않은 문서만 유지
        const updatedDocIds = updatedDocs.map(doc => doc.id)
        this.products = [
          ...this.products.filter(p => !updatedDocIds.includes(p.docId)),
          ...products.filter(p => updatedDocIds.includes(p.docId))
        ]

        // 문서 메타도 갱신
        this.documents = documents
        this.error = null
      } catch (err: any) {
        this.error = err?.message || '상품 불러오기 실패'
      } finally {
        this.loading = false
      }
    },

    async createProduct(product: Product) {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId) return

      await createProductService().create(companyId, product)
      await this.fetchProductsIfChanged()
    },

    async updateProduct(product: Product) {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId || !product.id) return

      await createProductService().update(companyId, product.id, product)
      await this.fetchProductsIfChanged()
    }
  },

  persist: {
    key: 'product',
    storage: localStorage,
    paths: ['products', 'documents']
  }
})
