// Pinia 스토어를 만드는 함수 (공통화된 로직을 재사용하기 위함)
import { defineStore } from 'pinia'
import type { ApiResponse } from '@/shared-types/apiResponse'
import {
  getCompanyCache,
  setCompanyCache,
} from '@/utils/companyCache'

// 제네릭 타입을 받아서, 어떤 데이터 타입이든 재사용할 수 있도록 설계
// 예: Product, Category, Option 등
export function createVersionedStore<T extends { id: string }>(options: {
  storeId: string // 스토어의 이름 (예: 'product', 'category')
  cacheKey: string // 캐시 저장소 키 이름 (company별 localStorage 구분용)
  getCompanyId: () => string | null // 회사 ID를 가져오는 함수
  getDataModified: (companyId: string, since: number) => Promise<ApiResponse<T[]>> // 수정된 데이터 API
  getDataDeleted: (companyId: string) => Promise<ApiResponse<string[]>> // 삭제된 ID 리스트 API

  getById: (companyId: string, id: string) => Promise<ApiResponse<T>>
  getAll: (companyId: string) => Promise<ApiResponse<T[]>>

}) {
  // defineStore: Pinia에서 스토어를 생성해주는 함수
  return defineStore(options.storeId, {
    // state: 스토어의 데이터 상태
    state: () => ({
      items: [] as T[], // 실제로 보여줄 항목들 (예: 상품 목록 등)
      dateLastFetched: 0, // 마지막으로 데이터를 받아온 시간 (timestamp)
      loading: false, // 서버 통신 중 여부
      error: null as string | null, // 오류 메시지
    }),

    // actions: 비동기 처리 또는 로직이 들어가는 곳 (서버와 통신 포함)
    actions: {
      /**
       * 현재 로그인한 회사의 ID를 가져오거나,
       * 없으면 에러 메시지를 기록하고 null 반환
       */
      getCompanyIdOrError(): string | null {
        const companyId = options.getCompanyId()
        if (!companyId) {
          this.error = '회사 정보 없음'
          return null
        }
        return companyId
      },

      /**
       * 회사별로 저장해둔 캐시(localStorage)를 불러와서 스토어에 복구
       * 새로고침했을 때 빠르게 데이터를 보여주기 위한 용도
       */
      restoreCache(): void {
        const companyId = this.getCompanyIdOrError()
        if (!companyId) return

        // 저장소에서 해당 회사의 데이터 복원
        const cached = getCompanyCache<{ items: T[]; dateLastFetched: number }>(
          options.cacheKey,
          companyId
        )
        if (cached) {
          this.items = cached.items as unknown as typeof this.items
          this.dateLastFetched = cached.dateLastFetched
        }
      },

      /**
       * 모든 캐시를 비우고 서버에서 다시 받아오는 전체 동기화
       */
      async syncFromScratch() {
        this.items = []
        this.dateLastFetched = 0
        return await this.syncWithServer() // 서버로부터 전체 데이터 재요청
      },
      /**
       * 서버와 동기화: 삭제된 항목 제거 + 변경된 항목 덮어쓰기
       * 필요 시 캐시도 함께 저장
       */
      async syncWithServer(): Promise<ApiResponse> {
        const companyId = this.getCompanyIdOrError()
        if (!companyId) return { isSuccess: false, message: '회사 정보 없음' }

        this.loading = true
        const now = Date.now()
        const oneDay = 1000 * 60 * 60 * 24
        const since = now - this.dateLastFetched > oneDay ? 0 : this.dateLastFetched

        try {
          // 1. 삭제된 ID 목록 가져오기
          const resDeleted = await options.getDataDeleted(companyId)
          // 2. 변경된 항목 가져오기
          const resModified = await options.getDataModified(companyId, since)

          if (!resModified.isSuccess) {
            this.error = resModified.message || '불러오기 실패'
            return { isSuccess: false, message: this.error }
          }
          // 3. 기존 항목 중 삭제된 ID는 제거
          const updatedItems = resModified.data ?? []
          const filtered = this.items.filter(i => !resDeleted.data?.includes(i.id))
          // 4. 기존 항목 중 수정되지 않은 것 + 수정된 항목을 합침
          const merged = [
            ...filtered.filter(i => !updatedItems.some(u => u.id === i.id)),
            ...updatedItems,
          ]
          // 5. 스토어에 반영
          this.items = merged as unknown as typeof this.items
          this.dateLastFetched = now
          this.error = null
          // 6. 캐시에 저장 (회사별)
          setCompanyCache(options.cacheKey, companyId, {
            items: this.items,
            dateLastFetched: this.dateLastFetched,
          })

          return { isSuccess: true }
        } catch (err: any) {
          this.error = err?.message || '불러오기 실패'
          return { isSuccess: false, message: this.error ?? '불러오기 실패' }
        } finally {
          this.loading = false
        }
      },
    },
  })() // ← defineStore 를 즉시 실행!
}
