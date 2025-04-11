// src/utils/versionCache.ts

export interface VersionCache {
    productVersion: number | null
    categoryVersion: number | null
    optionVersion: number | null
    optionGroupVersion: number | null
  }
  
  const STORAGE_KEY = 'companyVersionCache'
  
  export function saveVersionCache(cache: VersionCache) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  }
  
  export function loadVersionCache(): VersionCache {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        productVersion: null,
        categoryVersion: null,
        optionVersion: null,
        optionGroupVersion: null,
      }
    }
  
    try {
      return JSON.parse(raw) as VersionCache
    } catch {
      return {
        productVersion: null,
        categoryVersion: null,
        optionVersion: null,
        optionGroupVersion: null,
      }
    }
  }
  