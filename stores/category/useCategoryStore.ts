// stores/product/useProductStore.ts
import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import type { Category } from '@/shared-types/category/category'
import { createCategoryService } from '~/services/category/categoryService'

export const useCategoryStore = createVersionedStore<Category>({
  storeId: 'category',
  cacheKey: 'category',
  getCompanyId: () => useAuthStore().currentCompany?.id || null,
  getDataModified: (companyId, since) => createCategoryService().getModified(companyId, since),
  getDataDeleted: (companyId) => createCategoryService().getDeleted(companyId),
      getById: (companyId, id) => createCategoryService().getById(companyId, id),
      getAll: (companyId) => createCategoryService().getAll(companyId),
})
