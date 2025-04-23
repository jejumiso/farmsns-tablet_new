import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createOptionService } from '@/services/option/optionService'
import type { Option } from '@/shared-types/option/option'

export const useOptionStore = createVersionedStore<Option>({
  storeId: 'option',
  cacheKey: 'option',
  getDataModified: (companyId, since) =>
    createOptionService('admin').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createOptionService('admin').getDeleted(companyId),

  // ✅ CRUD 기능 포함
  saveItem: (companyId, item) =>
    createOptionService('admin').saveItem(companyId, item),
  saveItems: (companyId, items) =>
    createOptionService('admin').saveItems(companyId, items),
  deleteItem: (companyId, id) =>
    createOptionService('admin').deleteItem(companyId, id),
})
