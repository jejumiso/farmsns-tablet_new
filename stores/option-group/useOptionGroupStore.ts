// stores/optionGroup/optionGroupStore.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createOptionGroupService } from '@/services/option-group/optionGroupService'
import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'
import type { OptionGroup } from '@/shared-types/option/optionGroup'
import type { ApiResponse } from '@/shared-types/apiResponse'

export interface OptionGroupState {
  optionGroups: OptionGroup[]
  dateLastFetched: number
  loading: boolean
  error: string | null
}

export const useOptionGroupStore = defineStore('optionGroup', {
  state: (): OptionGroupState => ({
    optionGroups: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    getCompanyIdOrError(): string | null {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId) {
        this.error = '회사 정보가 없습니다.'
        return null
      }
      return companyId
    },

    async syncWithServer() {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return

      this.loading = true
      try {
        // ⏰ 24시간 경과 시 전체 동기화
        const now = Date.now()
        const oneDay = 1000 * 60 * 60 * 24 // 24시간
        const since = (now - this.dateLastFetched > oneDay) ? 0 : this.dateLastFetched

        // 1. 삭제된 ID 목록 조회
        const resDeleted = await createOptionGroupService().getDeleted(companyId)
        const deletedIds = resDeleted.isSuccess ? resDeleted.data ?? [] : []

        // 2. 수정된 데이터 조회
        const resModified = await createOptionGroupService().getModified(companyId, since)
        const updatedGroups = resModified.isSuccess ? (resModified.data ?? []) : []

        // 3. 기존 optionGroups에서 삭제 목록 제거
        const groupMap = new Map(this.optionGroups.map(g => [g.id, g]))
        for (const id of deletedIds) {
          groupMap.delete(id)
        }

        // 4. 수정된 항목 덮어쓰기
        for (const group of updatedGroups) {
          groupMap.set(group.id, group)
        }

        // 5. 갱신
        this.optionGroups = Array.from(groupMap.values())
        this.dateLastFetched = now
        this.error = null

        // 6. 버전 캐시 갱신
        const versionCache = loadVersionCache()
        versionCache.optionGroupVersion = useAuthStore().currentCompany?.optionGroupVersion ?? null
        saveVersionCache(versionCache)

      } catch (e: any) {
        console.error('📛 syncWithServer 실패:', e)
        this.error = e.message || '옵션 그룹 불러오기 실패'
      } finally {
        this.loading = false
      }
    },

    async saveOptionGroup(group: OptionGroup): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보가 없습니다.' }

      const res = await createOptionGroupService().save(companyId, group)
      if (!res.isSuccess) {
        this.error = res.message || '옵션 그룹 저장 실패'
      }
      return res
    },
    async deleteOptionGroup(id: string): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: '회사 정보가 없습니다.' }
    
      const res = await createOptionGroupService().deleteItem(companyId, id)
      if (res.isSuccess) {
        // 상태 반영
        this.optionGroups = this.optionGroups.filter(g => g.id !== id)
      }
      return res
    }
  },

  persist: {
    key: 'optionGroup',
    storage: localStorage,
    paths: ['optionGroups', 'dateLastFetched'],
  },
})
