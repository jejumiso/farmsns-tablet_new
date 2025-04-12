// plugins/sync.client.ts
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import {  watch,  } from 'vue';
// import 기타 store...

export default defineNuxtPlugin(() => {
  console.log('[plugin] sync.client.ts loaded ✅'); // 추가

  const authStore = useAuthStore()
  const productStore = useProductStore()
  const categoryStore = useCategoryStore()
  const optionStore = useOptionStore()
  const optionGroupStore = useOptionGroupStore()
  // 기타 store 초기화...

  watch(
    () => authStore.currentCompany?.id,
    async (companyId) => {
      console.log('[plugin] 회사 ID 변경 감지:', companyId) // 추가

      if (companyId) {
        await productStore.syncWithServer()
        await categoryStore.syncWithServer()
        await optionStore.syncWithServer()
        await optionGroupStore.syncWithServer()
        // 기타 store.syncWithServer()
      }
    },
    { immediate: true }
  )
})
