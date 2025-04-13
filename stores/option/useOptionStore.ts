// stores/product/useProductStore.ts
import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createOptionService } from '@/services/option/optionService'
import type { Option } from '@/shared-types/option/option'

export const useOptionStore = createVersionedStore<Option>({
  storeId: 'option',
  cacheKey: 'option',
  getCompanyId: () => useAuthStore().currentCompany?.id || null,
  getDataModified: (companyId, since) => createOptionService().getModified(companyId, since),
  getDataDeleted: (companyId) => createOptionService().getDeleted(companyId),
    getById: (companyId, id) => createOptionService().getById(companyId, id),
    getAll: (companyId) => createOptionService().getAll(companyId),
})
