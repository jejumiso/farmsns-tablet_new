import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createProductService } from '@/services/product/productService'
import type { Product } from '@/shared-types/product/product'

export const useProductStore = createVersionedStore<Product>({
  storeId: 'product',
  cacheKey: 'product',
  getDataModified: (companyId, since) =>
    createProductService('admin').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createProductService('admin').getDeleted(companyId),

  // ✅ 기본 CRUD 기능도 포함
  saveItem: (companyId, item) =>
    createProductService('admin').saveItem(companyId, item),
  saveItems: (companyId, items) =>
    createProductService('admin').saveItems(companyId, items),
  deleteItem: (companyId, id) =>
    createProductService('admin').deleteItem(companyId, id),
})
