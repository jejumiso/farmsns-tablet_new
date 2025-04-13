// stores/product/useProductStore.ts
import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createProductService } from '@/services/product/productService'
import type { Product } from '@/shared-types/product/product'

export const useProductStore = createVersionedStore<Product>({
  storeId: 'product',
  cacheKey: 'product',
  getCompanyId: () => useAuthStore().currentCompany?.id || null,
  getDataModified: (companyId, since) => createProductService().getModified(companyId, since),
  getDataDeleted: (companyId) => createProductService().getDeleted(companyId),
  getById: (companyId, id) => createProductService().getById(companyId, id),
  getAll: (companyId) => createProductService().getAll(companyId),
})
