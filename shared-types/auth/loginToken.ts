import { Timestamp } from "@/shared/firebase/firebaseTypes";


// 오로지 admin프로젝트에서만 쓰이고 있음
export interface LoginToken {
  id: string;                     // 로그인 토큰 ID
  companyId: string;                   
  phoneNumber: string;             // 전화번호
  rawToken: string;              
  uid: string;      
  dateLastUsed : Timestamp; // 마지막 사용 날짜
  createdAt: Timestamp;        // 생성 날짜
}