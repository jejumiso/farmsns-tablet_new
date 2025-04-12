// components/company/useCompanyWatcher.ts
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebaseDb } from '@/services/firebaseService'
import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import { saveVersionCache, loadVersionCache } from '@/utils/versionCache'
let unsubscribeCompany: (() => void) | null = null

export function watchCompanyRealtime(companyId: string) {
  unsubscribeCompany?.()
  const db = getFirebaseDb()
  console.log('🔥 db:', db) // ✅ 여기서 undefined 이면 문제

  const companyCollection = COLLECTION_PERMISSIONS.companies.name
  console.log('companyCollection:', companyCollection)
  console.log('companyId:', companyId)
  const companyDocRef = doc(db, companyCollection, companyId)

  const prevVersions = loadVersionCache()

  unsubscribeCompany = onSnapshot(companyDocRef, async (snapshot) => {
    const company = snapshot.data()
    if (!company) return

    // product 변경 감지
    if (company.productVersion !== prevVersions.productVersion) {
      console.log('🔁 상품 버전 변경 감지')
      const store = useProductStore()
      await store.syncWithServer()
      prevVersions.productVersion = company.productVersion
    }

    // category 변경 감지
    if (company.categoryVersion !== prevVersions.categoryVersion) {
      console.log('🔁 카테고리 버전 변경 감지')
      const store = useCategoryStore()
      await store.syncWithServer()
      prevVersions.categoryVersion = company.categoryVersion
    }

    // option 변경 감지
    if (company.optionVersion !== prevVersions.optionVersion) {
      console.log('🔁 옵션 버전 변경 감지')
      const store = useOptionStore()
      await store.syncWithServer()
      prevVersions.optionVersion = company.optionVersion
    }

    // optionGroup 변경 감지
    if (company.optionGroupVersion !== prevVersions.optionGroupVersion) {
      console.log('🔁 옵션 그룹 버전 변경 감지')
      const store = useOptionGroupStore()
      await store.syncWithServer()
      prevVersions.optionGroupVersion = company.optionGroupVersion
    }

    saveVersionCache(prevVersions)
  })
}

export function unwatchCompanyRealtime() {
  unsubscribeCompany?.()
  unsubscribeCompany = null
}
