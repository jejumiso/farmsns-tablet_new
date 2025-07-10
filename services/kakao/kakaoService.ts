//services/kakao/kakaoService.ts
import { useApi } from '@/composables/useApi'

import type { ApiResponse } from '@/shared-types/apiResponse'; // 상대 경로로 변경
import { decryptWithIv } from '@/shared-utils/crypto/decryption';

export function createKakaoService() {

  const api = useApi() // ✅ 여기서 axios 인스턴스 생성

  return {
    async profileAuth(plusid: string,phonenumber:string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/profileAuth', { plusid,phonenumber }); // api 인스턴스 사용
        console.log('인증번호 발송 성공 : ', response.data);
        return response.data;// ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('Failed to send SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },

    /**
     * 알리고에 plusid를 등록
     * @param plusid 
     * @param authnum 
     * @param phonenumber 
     * @param categorycode 
     * @returns 
     */
    async profileAdd(plusid: string,authnum: string,phonenumber:string,categorycode: string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/profileAdd', { plusid,authnum, phonenumber ,categorycode}); // api 인스턴스 사용
        console.log('SMS sent successfully:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Failed to send SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },

    /**
     * 📡 등록된 카카오채널 조회 (알리고 API: friendList)
     * 
     * 사용 방식:
     * - plusid, senderkey 모두 비우면 전체 목록 반환 (최고관리자 권한에서만 가능)
     * - plusid 또는 senderkey 중 하나 입력 시 해당 채널 정보 1건 또는 0건 반환
     * 
     * 일반적인 사용 시나리오:
     * - 이용 신청 시 plusid를 기준으로 조회
     * - 반환된 senderKey 및 채널명 정보를 기반으로 회사 DB 생성에 활용
     * 
     * 이용프로젝트 : farmsns-admin
     */
    async getFriendBySenderKey(plusid: string,senderkey: string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/friendList', { plusid,senderkey }); // api 인스턴스 사용
        console.log('friendList successfully:', response.data);
        if (response.data.isSuccess && response.data.data.length === 0) {
          return {
            isSuccess: false,
            message: '등록 된 키가 없습니다.',
            data: {}, 
          };
        }

        return {
          isSuccess: response.data.isSuccess,
          message: response.data.message,
          data: response.data.data[0], // ✅ 수정: response.data.data[0]
        };
        
        // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('Failed to send friendList:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },


    async templateList(resSenderkey: string,iv:string): Promise<ApiResponse> {
      try {
        const senderkey = decryptWithIv(resSenderkey, iv);
        const response = await api.post('/api/alligo/templateList', { senderkey}); // api 인스턴스 사용
        console.log('템플릿 목록 호출 결과:', response.data);
        if(response.data.code === 0 && response.data.list.length === 0){
          return {
            isSuccess: false,
            message: '등록 된 템플릿이 없습니다.',
            data: {}, // 필요한 데이터만 반환
          }; 
        }
        return {
          isSuccess: response.data.code === 0,
          message: response.data.message,
          data: response.data, // 필요한 데이터만 반환
        }; 
        
        
        // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('템플릿 목록 읽기 에러:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || '템플릿 목록 읽기 에러');
      }
    },

  };
}

export interface AuthService {
  profileAuth(plusid: string,phonenumber:string): Promise<void>;
}