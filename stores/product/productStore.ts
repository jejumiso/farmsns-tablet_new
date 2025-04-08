// src/stores/product/productStore.ts
import type { Product ,ProductState} from '@/shared-types/product/product'
import type {  DocumentMetaOnly } from '@/shared-types/common/documentMeta'
import { createProductService } from '@/services/product/productService'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { defineStore } from 'pinia'


export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    documents: [],
    dateLastFetched: 0,
    loading: false,
    error: null
  }),

  actions: {
    async fetchProductsIfChanged() {
      const authStore = useAuthStore();
      const companyId = authStore.currentCompany?.id || '';
      if (!companyId) {
        this.error = '회사 정보가 없습니다.';
        return;
      }

      this.loading = true;
      try {
        const storedProducts = this.products;  // 현재 저장소에서의 상품들
        const res = await createProductService().getCompanyProducts(companyId, this.dateLastFetched);

        const { products: fetchedProducts, documents: fetchedDocuments } = res.data as {
          products: Product[];  // products는 Product[] 타입
          documents: DocumentMetaOnly[];  // documents는 DocumentMeta[] 타입
        };

        // 1. 문서 목록 업데이트: fetchedDocuments에 속하지 않는 문서에 속한 상품들 삭제
        const fetchedDocumentIds = new Set(fetchedDocuments.map(doc => doc.id));
        const filteredProducts = storedProducts.filter(product => fetchedDocumentIds.has(product.docId));

        // 2. 상품 목록 업데이트: fetchedProducts에 속하는 문서의 상품들 삭제
        const fetchedProductDocIds = new Set(fetchedProducts.map(product => product.docId));
        const finalProducts = filteredProducts.filter(product => !fetchedProductDocIds.has(product.docId));

        // 3. 삭제된 상품 목록을 제외하고, fetchedProducts에 있는 상품들을 추가
        finalProducts.push(...fetchedProducts);

        // 저장소 업데이트
        this.products = finalProducts;
        this.documents = fetchedDocuments;
        this.dateLastFetched = Date.now(); // 최신 데이터의 timestamp로 갱신
        this.error = null;
      } catch (err: any) {
        this.error = err?.message || '상품 불러오기 실패';
      } finally {
        this.loading = false;
      }
    },

    async saveProduct(product: Product) {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) return;

      await createProductService().save(companyId, product);
      await this.fetchProductsIfChanged();
    },

    // async updateProduct(product: Product) {
    //   const companyId = useAuthStore().currentCompany?.id || '';
    //   if (!companyId || !product.id) return;

    //   await createProductService().save(companyId, product);
    //   await this.fetchProductsIfChanged();
    // },

    async refreshProducts() {
      await this.fetchProductsIfChanged();
    }
  },

  persist: {
    key: 'product',
    storage: localStorage,
    paths: ['products', 'documents']
  }
});
