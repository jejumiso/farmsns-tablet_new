import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { createOptionGroupService } from '@/services/option-group/optionGroupService';
import type { OptionGroup } from '@/shared-types/option/optionGroup';
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta';
import type { ApiResponse } from '~/shared-types/apiResponse';

export interface OptionGroupState {
  optionGroups: OptionGroup[];
  documents: DocumentMetaOnly[];
  dateLastFetched: number;
  loading: boolean;
  error: string | null;
}

export const useOptionGroupStore = defineStore('optionGroup', {
  state: (): OptionGroupState => ({
    optionGroups: [],
    documents: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOptionGroupsIfChanged() {
      const authStore = useAuthStore();
      const companyId = authStore.currentCompany?.id || '';
      if (!companyId) {
        this.error = '회사 정보가 없습니다.';
        return;
      }

      this.loading = true;
      try {
        const stored = this.optionGroups;
        const res = await createOptionGroupService().getCompanyOptionGroups(companyId, this.dateLastFetched);
      
        const { optionGroups: fetched, documents: fetchedDocuments } = res.data as {
          optionGroups: OptionGroup[];
          documents: DocumentMetaOnly[];
        };
      
        // 1. 삭제된 문서 제거
        const fetchedDocIds = new Set(fetchedDocuments.map(d => d.id));
        const filteredGroups = stored.filter(group => fetchedDocIds.has(group.docId));

        // 2. 서버에서 수정된 문서의 그룹 제거
        const updatedDocIds = new Set(fetched.map(g => g.docId));  // ✅ 문서 기준
        const remainingGroups = filteredGroups.filter(group => !updatedDocIds.has(group.docId));

        // 3. 최신 데이터 추가
        const updatedGroups = [...remainingGroups, ...fetched];

        // 4. 저장소 반영
        this.optionGroups = updatedGroups;
        this.documents = fetchedDocuments;
        this.dateLastFetched = Date.now();
        this.error = null;


      } catch (err: any) {
        this.error = err?.message || '옵션 그룹 불러오기 실패';
      } finally {
        this.loading = false;
      }
    },

    async saveOptionGroup(optionGroup: OptionGroup): Promise<ApiResponse> {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) {
        return {
          isSuccess: false,
          message: '회사 정보가 없습니다.',
        };
      }
    
      const result = await createOptionGroupService().save(companyId, optionGroup);
    
      if (result.isSuccess) {
        await this.fetchOptionGroupsIfChanged();
      }
    
      return result;
    },

  },
  persist: {
    key: 'optionGroup',
    storage: localStorage,
    paths: ['optionGroups', 'documents'],
  }
});
