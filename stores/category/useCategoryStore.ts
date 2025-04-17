import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import type { Category } from '@/shared-types/category/category'
import { createCategoryService } from '@/services/category/categoryService'

export const useCategoryStore = createVersionedStore<Category>({
  storeId: 'category',
  cacheKey: 'category',
  getDataModified: (companyId, since) =>
    createCategoryService().getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createCategoryService().getDeleted(companyId),

  // ✅ CRUD 기능 포함
  saveItem: (companyId, item) =>
    createCategoryService().saveItem(companyId, item),
  saveItems: (companyId, items) =>
    createCategoryService().saveItems(companyId, items),
  deleteItem: (companyId, id) =>
    createCategoryService().deleteItem(companyId, id),
})
