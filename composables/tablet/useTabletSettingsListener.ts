// src/composables/useTabletSettingsWatcher.ts
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import { createTabletSettingsService } from '@/services/tablet/tabletSettingsService'
import { doc, Firestore, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { createEmptyTabletSettings, type TabletSettings } from '~/shared-types/tablet-settings/tabletSettings'

let unsubscribe: (() => void) | null = null

export function useTabletSettingsWatcher() {
  const store = useTabletSettingsStore()

  const start = (companyId: string, tabletNumber: number) => {
    const db = useNuxtApp().$firebaseDb as Firestore

    if (unsubscribe) unsubscribe()

    const docRef = doc(db, 'v2_companies', companyId, 'v2_tablets', `tablet_${tabletNumber}`)

    unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (!snapshot.exists()) {
        console.warn('Tablet 설정 문서가 없습니다. 생성 요청합니다.')
        const service = createTabletSettingsService(companyId)
        const newDoc = createEmptyTabletSettings()
        newDoc.id = `tablet_${tabletNumber}`
        newDoc.pendingRewardAmount = 0
        await service.saveItem(newDoc)
        return
      }

      store.set(snapshot.data() as TabletSettings)
    })
  }

  const stop = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return { start, stop }
}
