// stores/product/useProductStore.ts
import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import type { OptionGroup } from '@/shared-types/option/optionGroup'
import { createOptionGroupService } from '@/services/option-group/optionGroupService'

export const useOptionGroupStore = createVersionedStore<OptionGroup>({
  storeId: 'optionGroup',
  cacheKey: 'optionGroup',
  getCompanyId: () => useAuthStore().currentCompany?.id || null,
  getDataModified: (companyId, since) => createOptionGroupService().getModified(companyId, since),
  getDataDeleted: (companyId) => createOptionGroupService().getDeleted(companyId),
  getById: (companyId, id) => createOptionGroupService().getById(companyId, id),
  getAll: (companyId) => createOptionGroupService().getAll(companyId),
})
