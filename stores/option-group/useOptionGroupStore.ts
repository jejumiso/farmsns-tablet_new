import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import type { OptionGroup } from '@/shared-types/option/optionGroup'
import { createOptionGroupService } from '@/services/option-group/optionGroupService'

export const useOptionGroupStore = createVersionedStore<OptionGroup>({
  storeId: 'optionGroup',
  cacheKey: 'optionGroup',
  getDataModified: (companyId, since) =>
    createOptionGroupService('admin').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createOptionGroupService('admin').getDeleted(companyId),

  // ✅ CRUD 기능 포함
  saveItem: (companyId, item) =>
    createOptionGroupService('admin').saveItem(companyId, item),
  saveItems: (companyId, items) =>
    createOptionGroupService('admin').saveItems(companyId, items),
  deleteItem: (companyId, id) =>
    createOptionGroupService('admin').deleteItem(companyId, id),
})
