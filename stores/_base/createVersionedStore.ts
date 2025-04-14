import { defineStore } from 'pinia'
import type { ApiResponse } from '@/shared-types/apiResponse'
import { getCompanyCache, setCompanyCache } from '@/utils/companyCache'
import { ref  } from 'vue'

interface CreateVersionedStoreOptions<T extends { id: string }> {
  storeId: string
  cacheKey: string
  getCompanyId: () => string | null
  getDataModified: (companyId: string, since: number) => Promise<ApiResponse<T[]>>
  getDataDeleted: (companyId: string) => Promise<ApiResponse<string[]>>
  saveItem?: (companyId: string, item: T) => Promise<ApiResponse<{ id: string }>>
  saveItems?: (companyId: string, items: T[]) => Promise<ApiResponse>
  deleteItem?: (companyId: string, id: string) => Promise<ApiResponse>
}

export function createVersionedStore<T extends { id: string }>(options: CreateVersionedStoreOptions<T>) {
  return defineStore(options.storeId, () => {
    // ✅ state를 ref로 선언
    const items = ref<T[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const itemCount = () => items.value.length
    const allItems = () => items.value

    function getCompanyIdOrError(): string | null {
      const companyId = options.getCompanyId()
      if (!companyId) {
        error.value = '회사 정보 없음'
        return null
      }
      return companyId
    }

    function restoreCache(): void {
      const companyId = getCompanyIdOrError()
      if (!companyId) return
      const cached = getCompanyCache<{ items: T[]; dateLastFetched: number }>(options.cacheKey, companyId)
      if (cached) {
        items.value = [...cached.items]
      }
    }
    

    async function syncFromScratch(): Promise<ApiResponse> {
      items.value = []
      return await syncWithServer()
    }

    async function syncWithServer(): Promise<ApiResponse> {
      const companyId = getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보 없음' }
    
      loading.value = true
    
      // ✅ 캐시에서 최근 읽은 시각을 가져와서 비교 기준으로 사용
      const cached = getCompanyCache<{ items: T[]; dateLastFetched: number }>(options.cacheKey, companyId)
      const lastFetched = cached?.dateLastFetched ?? 0
    
      const now = Date.now()
      const oneDay = 1000 * 60 * 60 * 24
      const since = now - lastFetched > oneDay ? 0 : lastFetched
    
      const resDeleted = await options.getDataDeleted(companyId)
      const resModified = await options.getDataModified(companyId, since)
    
      if (!resModified.isSuccess) {
        error.value = resModified.message || '불러오기 실패'
        return { isSuccess: false, message: error.value }
      }
    
      const updatedItems = resModified.data ?? []
      const filtered = items.value.filter(i => !resDeleted.data?.includes(i.id))
      const merged = [
        ...filtered.filter(i => !updatedItems.some(u => u.id === i.id)),
        ...updatedItems,
      ]
    
      items.value = [...merged] as T[]
      error.value = null
    
      setCompanyCache(options.cacheKey, companyId, {
        items: items.value,
        dateLastFetched: now,
      })
    
      return { isSuccess: true, data: items.value }
    }
    

    async function saveItem(item: T): Promise<ApiResponse<{ id: string }>> {
      if (!options.saveItem) throw new Error('saveItem 함수가 주입되지 않았습니다.')
      const companyId = getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보 없음' }

      const res = await options.saveItem(companyId, item)
      if (!res.isSuccess || !res.data?.id) return res

      const { id } = res.data
      const updated = items.value.filter(p => p.id !== id)
      updated.push({ ...item, id } as any)


      items.value = [...updated]

      return res
    }

    async function saveItems(itemList: T[]): Promise<ApiResponse> {
      if (!options.saveItems) throw new Error('saveItems 함수가 주입되지 않았습니다.')
      const companyId = getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보 없음' }

      const res = await options.saveItems(companyId, itemList)
      if (res.isSuccess) {
        const updated = [...items.value]
        for (const item of itemList) {
          const index = updated.findIndex(p => p.id === item.id)
          if (index !== -1) updated[index] = item as any
          else updated.push(item as any)
        }
        items.value = [...updated]
      }

      return res
    }

    async function deleteItem(id: string): Promise<ApiResponse> {
      if (!options.deleteItem) throw new Error('deleteItem 함수가 주입되지 않았습니다.')
      const companyId = getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보 없음' }

      const res = await options.deleteItem(companyId, id)
      if (res.isSuccess) {
        items.value = items.value.filter(p => p.id !== id)
      }

      return res
    }

    return {
      items,
      loading,
      error,
      itemCount,
      allItems,
      getCompanyIdOrError,
      restoreCache,
      syncFromScratch,
      syncWithServer,
      saveItem,
      saveItems,
      deleteItem,
    }
  })
}