// stores/option/optionStore.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { createOptionService } from '@/services/option/optionService'
import type { Option } from '@/shared-types/option/option'
import type { ApiResponse } from '~/shared-types/apiResponse'
import { loadVersionCache, saveVersionCache } from '@/utils/versionCache'


const ERROR_MESSAGE = {
  noCompany: '회사 정보가 없습니다.',
  loadFailed: '상품 불러오기 실패',
  saveFailed: '상품 저장 실패',
  deleteFailed: '상품 삭제 실패',
}

interface OptionState {
  options: Option[]
  dateLastFetched: number
  loading: boolean
  error: string | null
}

export const useOptionStore = defineStore('option', {
  state: (): OptionState => ({
    options: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    getCompanyIdOrError(): string | null {
      const companyId = useAuthStore().currentCompany?.id || ''
      if (!companyId) {
        this.error = ERROR_MESSAGE.noCompany
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
        const resDeleted = await createOptionService().getDeleted(companyId)
        const deletedIds = resDeleted.isSuccess ? resDeleted.data ?? [] : []

        // 2. 수정된 데이터 조회
        const resModified = await createOptionService().getModified(companyId, since)
        const updatedOptions = resModified.isSuccess ? (resModified.data ?? []) : []

        // 3. 기존 options에서 삭제 목록 제거
        const optionMap = new Map(this.options.map(o => [o.id, o]))
        for (const id of deletedIds) {
          optionMap.delete(id)
        }

        // 4. 수정된 항목 덮어쓰기
        for (const option of updatedOptions) {
          optionMap.set(option.id, option)
        }

        // 5. 갱신
        this.options = Array.from(optionMap.values())
        this.dateLastFetched = now
        this.error = null

        // 6. 버전 캐시 갱신
        const versionCache = loadVersionCache()
        versionCache.optionVersion = useAuthStore().currentCompany?.optionVersion ?? null
        saveVersionCache(versionCache)

      } catch (e: any) {
        console.error('📛 syncWithServer 실패:', e)
        this.error = e.message || ERROR_MESSAGE.loadFailed
      } finally {
        this.loading = false
      }
    },

    async saveOption(option: Option): Promise<ApiResponse> {
      const companyId = this.getCompanyIdOrError()
      if (!companyId) return { isSuccess: false, message: ERROR_MESSAGE.noCompany }

      const res = await createOptionService().save(companyId, option)
      if (!res.isSuccess) {
        this.error = res.message || ERROR_MESSAGE.saveFailed
      }
      return res
    },

    async deleteOption(id: string): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) {
        return { isSuccess: false, message: '회사 정보가 없습니다.' };
      }
    
      const res = await createOptionService().deleteItem(companyId, id);
      if (res.isSuccess) {
        this.options = this.options.filter(option => option.id !== id);
      } else {
        this.error = res.message || '옵션 삭제 실패';
      }
      return res;
    }
  },

  persist: {
    key: 'option',
    storage: localStorage,
    paths: ['options', 'dateLastFetched'],
  },
})
