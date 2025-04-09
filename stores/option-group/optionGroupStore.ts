import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { createOptionGroupService } from '@/services/option-group/optionGroupService';
import type { OptionGroup } from '@/shared-types/option/optionGroup';
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta';

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

        const fetchedDocIds = new Set(fetchedDocuments.map(doc => doc.id));
        const filtered = stored.filter(g => fetchedDocIds.has(g.docId));

        const fetchedGroupDocIds = new Set(fetched.map(g => g.docId));
        const finalGroups = filtered.filter(g => !fetchedGroupDocIds.has(g.docId));

        finalGroups.push(...fetched);

        this.optionGroups = finalGroups;
        this.documents = fetchedDocuments;
        this.dateLastFetched = Date.now();
        this.error = null;
      } catch (err: any) {
        this.error = err?.message || '옵션 그룹 불러오기 실패';
      } finally {
        this.loading = false;
      }
    },

    async saveOptionGroup(optionGroup: OptionGroup) {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId) return;

      await createOptionGroupService().save(companyId, optionGroup);
      await this.fetchOptionGroupsIfChanged();
    },

    async refreshOptionGroups() {
      await this.fetchOptionGroupsIfChanged();
    }
  },

  persist: {
    key: 'optionGroup',
    storage: localStorage,
    paths: ['optionGroups', 'documents'],
  }
});
