import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import type { OptionGroup } from '@/shared-types/option/optionGroup'
import { createOptionGroupService } from '@/services/option-group/optionGroupService'

export const useOptionGroupStore = createVersionedStore<OptionGroup>({
  storeId: 'optionGroup',
  cacheKey: 'optionGroup',
  getDataModified: (companyId, since) =>
    createOptionGroupService().getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createOptionGroupService().getDeleted(companyId),

  // ✅ CRUD 기능 포함
  saveItem: (companyId, item) =>
    createOptionGroupService().saveItem(companyId, item),
  saveItems: (companyId, items) =>
    createOptionGroupService().saveItems(companyId, items),
  deleteItem: (companyId, id) =>
    createOptionGroupService().deleteItem(companyId, id),
})
