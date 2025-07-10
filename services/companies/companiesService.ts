// 📁 services/companies/companiesService.ts
// 현재버전: 1.0.2
// 설명: 카카오채널 ID로 회사 정보를 조회하는 서비스 함수
// 작성일: 2025-07-10

import { useApi } from '@/composables/useApi'
import type { Company } from '@/shared-types/company/company'


export function createCompaniesService() {
  const api = useApi()

  return {

    /**
     * 카카오채널 ID를 기준으로 회사를 조회합니다.
     *
     * @param kakaoChannelId - 조회할 카카오채널 ID (예: @farmsns)
     * @returns 조회된 첫 번째 회사 객체 또는 null
     * @throws 회사 조회 중 오류 발생 시 예외를 던집니다.
     *
     * 사용 맥락:
     * - farmsns는 카카오채널 ID 기준으로 회사 DB가 1:1로 생성됨
     * - 관리자 페이지에서 이용 신청 시, 입력된 ID로 이미 회사가 존재하는지 확인
     * - 회사가 이미 존재하면 중복 생성을 막고, 존재하지 않으면 신규 등록 절차로 진행
     *
     * 비즈니스 조건:
     * - `return === null` 이어야 정상적인 신규 이용 신청이 가능합니다.
     *
     * 사용 프로젝트: farmsns-admin
     */
    async getCompanyByKakaoChannelId(kakaoChannelId: string): Promise<Company | null> {
      try {
        const response = await api.get('/api/companies/search-by-kakao-channel-id', {
          params: { kakaoChannelId },
        });

        const companies = response.data?.data;

        if (!Array.isArray(companies)) {
          throw new Error('응답 형식 오류: data가 배열이 아닙니다.');
        }

        if (companies.length > 1) {
          throw new Error(`데이터 오류: kakaoChannelId "${kakaoChannelId}"로 조회된 회사가 ${companies.length}건 존재합니다.`);
        }

        if (companies.length === 1) {
          return companies[0] as Company;
        }

        return null;
      } catch (error: any) {
        console.error('❌ 회사 검색 실패:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || '회사 검색 실패');
      }
    }





  }
}
