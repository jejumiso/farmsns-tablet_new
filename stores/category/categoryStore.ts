// stores/category/categoryStore.ts
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { createCategoryService } from '@/services/category/categoryService';
import { createCategoriesService } from '@/services/categories/categoriesService';
import type { Category } from '@/shared-types/category/category';
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta';
import type { ApiResponse } from '@/shared-types/apiResponse';

export interface CategoryState {
  categories: Category[];
  documents: DocumentMetaOnly[];
  dateLastFetched: number;
  loading: boolean;
  error: string | null;
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    documents: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategoriesIfChanged() {
      const authStore = useAuthStore();
      const companyId = authStore.currentCompany?.id || '';
      if (!companyId) {
        this.error = '회사 정보가 없습니다.';
        return;
      }

      this.loading = true;
      try {
        const stored = this.categories;
        const res = await createCategoriesService().getCompanyCategories(companyId, this.dateLastFetched);
        const { categories: fetched, documents: fetchedDocuments } = res.data as {
          categories: Category[];
          documents: DocumentMetaOnly[];
        };

// 1. 삭제된 문서의 카테고리 제거
const fetchedDocIds = new Set(fetchedDocuments.map(doc => doc.id));
const filteredCategories = stored.filter(category => fetchedDocIds.has(category.docId));

// 2. 수정된 문서에 속한 카테고리 제거
const updatedDocIds = new Set(fetched.map(cat => cat.docId));
const remainingCategories = filteredCategories.filter(cat => !updatedDocIds.has(cat.docId));

// 3. 최신 카테고리 추가
const updatedCategories = [...remainingCategories, ...fetched];

// 4. 저장소에 반영
this.categories = updatedCategories;
this.documents = fetchedDocuments;
this.dateLastFetched = Date.now();
this.error = null;


      } catch (err: any) {
        this.error = err.message || '카테고리 불러오기 실패';
      } finally {
        this.loading = false;
      }
    },

    async saveCategory(category: Category): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) return { isSuccess: false, message: '회사 정보가 없습니다.' };
      console.log('📡 LOGGER - saveCategory:', category);
      const res = await createCategoryService().save(companyId, category);
      if (res.isSuccess) await this.fetchCategoriesIfChanged();
      return res;
    },

    async deleteCategory(category: Category): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) return { isSuccess: false, message: '회사 정보가 없습니다.' };

      const res = await createCategoryService().delete(companyId, category.docId, category.id);
      if (res.isSuccess) await this.fetchCategoriesIfChanged();
      return res;
    }
  },

  persist: {
    key: 'category',
    storage: localStorage,
    paths: ['categories', 'documents'],
  }
});