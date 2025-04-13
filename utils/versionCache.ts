export interface SingleVersionCache {
  productVersion: number
  categoryVersion: number
  optionVersion: number
  optionGroupVersion: number
}

export type AllVersionCache = Record<string, SingleVersionCache> // key: companyId

const STORAGE_KEY = 'companyVersionCache'

// 기본값 생성
function getDefaultCache(): SingleVersionCache {
  return {
    productVersion: 0,
    categoryVersion: 0,
    optionVersion: 0,
    optionGroupVersion: 0,
  }
}

// 로드
export function loadVersionCache(companyId: string): SingleVersionCache {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return getDefaultCache()

  try {
    const allCache = JSON.parse(raw) as AllVersionCache
    return allCache[companyId] ?? getDefaultCache()
  } catch {
    return getDefaultCache()
  }
}

// 저장
export function saveVersionCache(companyId: string, cache: Partial<SingleVersionCache>) {
  const raw = localStorage.getItem(STORAGE_KEY)
  let allCache: AllVersionCache = {}

  try {
    allCache = raw ? JSON.parse(raw) : {}
  } catch {
    allCache = {}
  }

  const prev = allCache[companyId] ?? getDefaultCache()
  allCache[companyId] = { ...prev, ...cache }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allCache))
}
