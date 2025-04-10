import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { createOptionService } from '@/services/option/optionService';
import type { Option } from '@/shared-types/option/option';
import type { DocumentMetaOnly } from '@/shared-types/common/documentMeta';
import type { ApiResponse } from '~/shared-types/apiResponse';

// 상태 타입 정의
interface OptionState {
  options: Option[];                 // 옵션 전체 목록
  documents: DocumentMetaOnly[];    // 문서 메타 목록 (id, date 등만)
  dateLastFetched: number;          // 마지막으로 데이터 fetch한 시간 (밀리초 기준)
  loading: boolean;                 // 로딩 중 여부
  error: string | null;             // 에러 메시지
}

// 옵션 관련 Pinia 스토어 정의
export const useOptionStore = defineStore('option', {
  state: (): OptionState => ({
    options: [],
    documents: [],
    dateLastFetched: 0,
    loading: false,
    error: null,
  }),

  actions: {
    // 🔄 서버에서 옵션 목록을 불러오되, 변경된 경우만 갱신
    async fetchOptionsIfChanged() {
      const authStore = useAuthStore();
      const companyId = authStore.currentCompany?.id || '';
      
      if (!companyId) {
        this.error = '회사 정보가 없습니다.';
        return Promise.resolve(); // ⛳ 명시적으로 종료
      }

      this.loading = true;
      try {
        const storedOptions: Option[] = this.options;

        // ✅ 서버에서 옵션과 문서 정보 fetch (since 활용)
        const res = await createOptionService().getCompanyOptions(
          companyId,
          this.dateLastFetched
        );

        const { options: fetchedOptions, documents: fetchedDocuments } = res.data as {
          options: Option[];
          documents: DocumentMetaOnly[];
        };

        // 1. 삭제된 문서의 옵션 제거
        const fetchedDocIds = new Set(fetchedDocuments.map(d => d.id));
        const filteredOptions = storedOptions.filter(option => fetchedDocIds.has(option.docId));

        // 2. 서버에서 수정된 문서의 docId에 속한 옵션 제거
        const updatedDocIds = new Set(fetchedOptions.map(opt => opt.docId));
        const remainingOptions = filteredOptions.filter(option => !updatedDocIds.has(option.docId));

        // 3. 서버에서 받은 최신 옵션 추가
        const updatedOptions = [...remainingOptions, ...fetchedOptions];

        // 4. 저장소에 반영
        this.options = updatedOptions;
        this.documents = fetchedDocuments;
        this.dateLastFetched = Date.now();
        this.error = null;

      } catch (err: any) {
        this.error = err?.message || '옵션 불러오기 실패';
      } finally {
        this.loading = false;
      }
    },

    // ✅ 옵션 추가 또는 수정 (서버에 저장 후 재갱신)
    async saveOption(option: Option):Promise<ApiResponse>  {
     
      const authStore = useAuthStore();
      const companyId = authStore.currentCompany?.id || '';
      
      if (!companyId) {
        return {
          isSuccess: false,
          message: '회사 정보가 없습니다.',
        };
      }

      const res = await createOptionService().save(companyId, option);
      if (!res.isSuccess) {
        this.error = res.message || '옵션 저장 실패';
      } else {
        await this.fetchOptionsIfChanged();
      }
    
      return res;
    },
    async deleteOption(option: Option) {
      const companyId = useAuthStore().currentCompany?.id || '';
      if (!companyId || !option.docId) {
        return { isSuccess: false, message: '회사 ID 또는 docId가 없습니다.' };
      }
      return await createOptionService().delete(companyId, option.docId, option.id);
    },

    // ✅ 강제 새로고침
    async refreshOptions() {
      await this.fetchOptionsIfChanged();
    }
  },

  // ✅ 로컬스토리지에 옵션 상태 저장
  persist: {
    key: 'option',
    storage: localStorage,
    paths: ['options', 'documents', 'dateLastFetched'], // 선택적: dateLastFetched 포함
  }
});
