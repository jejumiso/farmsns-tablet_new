// types/apiResponse.ts
export interface ApiResponse<T = any> {
    isSuccess: boolean;
    statusCode?: number;  // 응답 상태 코드 추가
    data?: T;
    error?: string;
    message?: string;
}  


//페이징은 안할꺼라 lastDocId는 필요없음음