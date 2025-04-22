// src/utils/watchTabletSettings.ts
import { doc, Firestore, onSnapshot } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useNuxtApp } from '#app'
import { createEmptyTabletSettings, type TabletSettings } from '~/shared-types/tablet-settings/tabletSettings'
import { useTabletSettingsStore } from '~/stores/tablet/useTabletSettingsStore'
import { createTabletSettingsService } from '~/services/tablet/tabletSettingsService'

let unsubscribeTabletSettings: (() => void) | null = null

export function stopTabletSettingsWatcher() {
  if (unsubscribeTabletSettings) {
    unsubscribeTabletSettings()
    unsubscribeTabletSettings = null
  }
}

export function watchTabletSettings(companyId: string, tabletNumber: number) {
  const nuxtApp = useNuxtApp()
  const db = nuxtApp.$firebaseDb as Firestore // ✅ 타입 명시


  // ✅ 이전 구독 해제
  if (unsubscribeTabletSettings) {
    unsubscribeTabletSettings()
    unsubscribeTabletSettings = null
  }

  const docRef = doc(db, 'v2_companies', companyId, 'v2_tablets', `tablet_${tabletNumber}`) // ✅ 정확한 인자 순서


  unsubscribeTabletSettings = onSnapshot(docRef, async (snapshot) => {
    if (!snapshot.exists()) {
        console.warn('⚠️ TabletSettings 문서 없음 → 서버에 생성 요청')
      
        try {
          const service = createTabletSettingsService(companyId)
          const tabletId = `tablet_${tabletNumber}`
      
          await service.save(tabletId, createEmptyTabletSettings()) // ✅ 서비스 사용
          console.info('✅ 서버에 TabletSettings 생성 요청 완료' + tabletId)
        } catch (error) {
          console.error('❌ TabletSettings 생성 실패:', error)
        }
      
        return
      }
  
    const data = snapshot.data() as TabletSettings
    const tabletSettingsStore = useTabletSettingsStore()
  
    tabletSettingsStore.settings = {
      ...tabletSettingsStore.settings,
      ...data,
    }
  
    console.log('✅ TabletSettings 업데이트:', data)
  })
  
}
