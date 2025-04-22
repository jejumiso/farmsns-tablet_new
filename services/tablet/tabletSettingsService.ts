// src/services/tablet/tabletSettingsService.ts
import { createSubcollectionService } from '@/services/common/subcollectionService'
import type { TabletSettings } from '@/shared-types/tablet-settings/tabletSettings'

export function createTabletSettingsService(companyId: string) {
  return createSubcollectionService<TabletSettings>(
    'v2_companies',             // 🔁 상위 컬렉션 (회사)
    companyId,                  // 📌 회사 ID
    'v2_tablets',               // 🔁 서브컬렉션 (태블릿 설정)
    'admin'                     // 🔐 API 접근 권한 (admin 모드)
  )
}
