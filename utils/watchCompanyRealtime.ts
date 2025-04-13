// src/utils/watchCompanyRealtime.ts

import { onSnapshot, doc } from 'firebase/firestore'
import { getFirebaseDb } from '~/services/firebaseService'
import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'
import { versionWatchers, type VersionKey } from '@/constants/versionWatchers'
import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'

let unsubscribeCompany: (() => void) | null = null

export function stopCompanyRealtimeWatcher() {
  if (unsubscribeCompany) {
    unsubscribeCompany()
    unsubscribeCompany = null
  }
}

export function watchCompanyRealtime(companyId: string) {
  const companyDocRef = doc(
    getFirebaseDb(),
    COLLECTION_PERMISSIONS.company.name,
    companyId
  )

  let prevVersions = loadVersionCache(companyId)

  unsubscribeCompany = onSnapshot(companyDocRef, async (snapshot) => {
    if (!snapshot.exists()) return

    const company = snapshot.data()

    for (const key of Object.keys(versionWatchers) as VersionKey[]) {
      const watcher = versionWatchers[key]
      const newVersion = company[key]
      const oldVersion = prevVersions[key]

      if (typeof newVersion === 'number' && typeof oldVersion === 'number' && newVersion !== oldVersion) {
        const majorNew = Math.floor(newVersion)
        const majorOld = Math.floor(oldVersion)

        if (majorNew !== majorOld) {
          console.log(`🔁 ${watcher.label} 스키마 변경 감지 → 전체 초기화`)
          await (watcher.store() as any).syncFromScratch?.()

        } else {
          console.log(`🔄 ${watcher.label} 단순 변경 감지 → 변경 항목만 동기화`)
          await (watcher.store() as any).syncWithServer?.()
        }

        prevVersions[key] = newVersion
        saveVersionCache(companyId, { [key]: newVersion })
      }
    }
  })
}
