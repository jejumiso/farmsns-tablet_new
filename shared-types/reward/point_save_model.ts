// // PointSaveModel 타입 정의 및 빈 객체 생성 함수 파일
// import { Timestamp, GeoPoint } from 'firebase/firestore';
// // 포인트 적립 모델 타입 정의
// export type PointSaveModel = {
//     id: string; // 고유 ID
//     phoneNumber: string,
//     idUser: string; // 사용자 ID
//     idCompany: string; // 회사 ID
//     idOrder: string; // 주문 ID
//     resUserPhoneNumber: string; // 사용자 전화번호
//     resAdminPhoneNumber: string,
//     saveType: string; // 포인트 적립 유형 (offline=테블릿적립, webOrder 등)
//     saveType2: string;
//     memo: string; // 메모
//     stamp: number; // 적립된 스탬프 수
//     point: number;
//     stampRemaining: number; // 남아 있는 스탬프 수
//     pointRemaining: number; // 
//     tabletNum: number,
//     dateModified : Timestamp;
//     dateCreated: Timestamp; // 생성 날짜
//     dateCreateyyyy: number; // 날짜 정보 (메모용, 거의 사용되지 않음)
//     dateCreateyyyyMM: number; // 날짜 정보 (메모용, 거의 사용되지 않음)
//     dateCreateyyyyMMdd: number; // 날짜 정보 (메모용, 거의 사용되지 않음)
//     adminUserId: string,
//     dateCreate: Timestamp; // 생성 날짜
// };
