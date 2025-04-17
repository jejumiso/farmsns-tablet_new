// src/utils/cache/versionCache.ts
import { getCompanyCache, setCompanyCache, clearCompanyCache } from '@/utils/cache/companyCache'
import type { VersionKey } from '@/constants/versionWatchers'
import { versionKeys } from '@/constants/versionWatchers'
/**
 * 버전 캐시 타입 정의
 */
export type SingleVersionCache = {
  [K in VersionKey]: number
}

/**
 * 기본 버전 값
 */
function getDefaultCache(): SingleVersionCache {
  const defaultCache = {} as SingleVersionCache
  for (const key of versionKeys) {
    defaultCache[key] = 0
  }
  return defaultCache
}

const CACHE_TYPE = 'version'

export function loadVersionCache(companyId: string): SingleVersionCache {
  return getCompanyCache<SingleVersionCache>(CACHE_TYPE, companyId) ?? getDefaultCache()
}

export function saveVersionCache(companyId: string, partial: Partial<SingleVersionCache>) {
  const prev = loadVersionCache(companyId)
  const merged = { ...prev, ...partial }
  setCompanyCache(CACHE_TYPE, companyId, merged)
}

export function clearVersionCache(companyId: string) {
  clearCompanyCache(CACHE_TYPE, companyId)
}
