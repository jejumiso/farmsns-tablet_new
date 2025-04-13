// import { onSnapshot, doc } from 'firebase/firestore'
// import { versionWatchers, type VersionKey } from '@/constants/versionWatchers'
// import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'
// import { useAuthStore } from '@/stores/auth/useAuthStore'
// import { getFirebaseDb } from '@/services/firebaseService'
// import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'

// export let unsubscribeCompany: (() => void) | null = null

// export function watchCompanyRealtime(companyId : string) {
//   if (!companyId) return
//   const companyCollection = COLLECTION_PERMISSIONS.companies.name
//   const companyDocRef = doc(getFirebaseDb(), companyCollection, companyId)
//   let prevVersions = loadVersionCache()

//   unsubscribeCompany = onSnapshot(companyDocRef, async (snapshot) => {
//     const company = snapshot.data()
//     if (!company) return

//     let versionChanged = false

//     for (const key of Object.keys(versionWatchers) as VersionKey[]) {
//       const newVersion = company[key]
//       const oldVersion = prevVersions[key]

//       if (newVersion != null && oldVersion != null && newVersion !== oldVersion) {
//         const majorNew = Math.floor(newVersion)
//         const majorOld = Math.floor(oldVersion)

//         const { store, label } = versionWatchers[key]

//         if (majorNew !== majorOld) {
//           console.log(`🧨 ${label} 스키마 변경 감지 → 전체 초기화`)
//           await store().syncFromScratch?.()
//         } else {
//           console.log(`🔄 ${label} 변경 감지 → 변경 항목만 동기화`)
//           await store().syncWithServer?.()
//         }

//         // 변경된 버전 저장
//         prevVersions[key] = newVersion
//         versionChanged = true
//       }
//     }

//     // 저장소에 반영
//     if (versionChanged) {
//       saveVersionCache(prevVersions)
//     }
//   })
// }
