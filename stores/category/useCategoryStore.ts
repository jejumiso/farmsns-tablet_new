// stores/category/categoryStore.ts
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { createCategoryService } from '@/services/category/categoryService';
import type { Category } from '@/shared-types/category/category';
import type { ApiResponse } from '@/shared-types/apiResponse';
import { loadVersionCache, saveVersionCache } from '~/utils/versionCache';

const ERROR_MESSAGE = {
  noCompany: '회사 정보가 없습니다.',
  loadFailed: '상품 불러오기 실패',
  saveFailed: '상품 저장 실패',
  deleteFailed: '상품 삭제 실패',
}

export interface CategoryState {
  categories: Category[];
  dateLastFetched: number;
  loading: boolean;
  error: string | null;
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async syncWithServer() {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId) {
        this.error = ERROR_MESSAGE.noCompany
        return
      }
    
      this.loading = true
      try {
        // ⏰ 24시간 경과 시 전체 동기화
        const now = Date.now()
        const oneDay = 1000 * 60 * 60 * 24 // 24시간
        const since = (now - this.dateLastFetched > oneDay) ? 0 : this.dateLastFetched
    
        // 1. 삭제된 ID 목록 조회
        const resDeleted = await createCategoryService().getDeleted(companyId)
        const deletedIds = resDeleted.isSuccess ? resDeleted.data ?? [] : []
    
        // 2. 수정된 데이터 조회
        const resModified = await createCategoryService().getModified(companyId, since)
        const updatedCategories = resModified.isSuccess ? (resModified.data ?? []) : []
    
        // 3. 기존 categories에서 삭제 목록 제거
        const categoryMap = new Map(this.categories.map(c => [c.id, c]))
        for (const id of deletedIds) {
          categoryMap.delete(id)
        }
    
        // 4. 수정된 항목 덮어쓰기
        for (const category of updatedCategories) {
          categoryMap.set(category.id, category)
        }
    
        // 5. 갱신
        this.categories = Array.from(categoryMap.values())
        this.dateLastFetched = now
        this.error = null
    
        // 6. 버전 캐시 갱신
        const versionCache = loadVersionCache()
        versionCache.categoryVersion = useAuthStore().currentCompany?.categoryVersion ?? null
        saveVersionCache(versionCache)
    
      } catch (e: any) {
        console.error('📛 syncWithServer 실패:', e)
        this.error = e.message || ERROR_MESSAGE.loadFailed
      } finally {
        this.loading = false
      }
    },  

    async saveCategory(category: Category): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany };
      console.log('📡 LOGGER - saveCategory:', category);
      const res = await createCategoryService().save(companyId, category);
      return res;
    },

    async deleteCategory(id: string): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) {
        return { isSuccess: false, message: '회사 정보가 없습니다.' };
      }
    
      const res = await createCategoryService().deleteItem(companyId, id);
      if (res.isSuccess) {
        this.categories = this.categories.filter(category => category.id !== id);
      } else {
        this.error = res.message || '카테고리 삭제 실패';
      }
      return res;
    }
    
  },

  persist: {
    key: 'category',
    storage: localStorage,
    paths: ['categories', 'dateLastFetched'],
  }
});