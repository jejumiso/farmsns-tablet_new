// utils/companyCache.ts

const CACHE_KEY_PREFIX = 'companyDataCache'

/**
 * 회사별 캐시 불러오기
 * @param type 캐시 타입 (예: 'product', 'category')
 * @param companyId 회사 ID
 * @returns T 타입의 캐시 객체
 */
export function getCompanyCache<T>(type: string, companyId: string): T | null {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`
  const raw = localStorage.getItem(key)

  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * 회사별 캐시 저장
 * @param type 캐시 타입
 * @param companyId 회사 ID
 * @param data 저장할 데이터 (T)
 */
export function setCompanyCache<T>(type: string, companyId: string, data: T) {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * 회사별 캐시 초기화
 * @param type 캐시 타입
 * @param companyId 회사 ID
 */
export function clearCompanyCache(type: string, companyId: string) {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`
  localStorage.removeItem(key)
}
