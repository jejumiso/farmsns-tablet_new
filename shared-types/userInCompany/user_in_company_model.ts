// option_model.ts
import { Timestamp } from 'firebase-admin/firestore'


// 사용자 회사 정보 타입 정의
export type UserInCompanyType = {
    id: string; // 문서 ID
    phoneNumber: string,
    // orderCount: number; // 주문 횟수
    // orderTotal: number; // 총 주문 금액
    // phoneNumber: string; // 사용자 전화번호 (암호화되지 않은 상태)
    stampCount: number; // 총 적립된 스탬프 횟수
    stampLast: number; // 마지막으로 적립된 스탬프 수량
    stampRemaining: number; // 현재 남아 있는 스탬프 수량
    stampTotal: number; // 총 적립된 스탬프의 누적 수량
    couponRemaining: number;
    couponTotal: number;
    pointCount: number; // 총 적립된 스탬프 횟수
    pointLast: number; // 마지막으로 적립된 스탬프 수량
    pointRemaining: number; // 현재 남아 있는 스탬프 수량
    pointTotal: number; // 현재 남아 있는 스탬프 수량
    shopPoint: number; // 주문 횟수
    shopMoney: number; // 주문 횟수
    orderTotalCount: number; // 주문 횟수
    orderTotalPrice: number; // 주문 횟수
    coupons: any[];

    dateModified: Timestamp; // 마지막 수정 날짜
    dateCreated: Timestamp; // 생성 날짜
};

// // UserInCompanyType의 빈 값을 반환하는 함수
// export function getEmptyUserInCompany(): UserInCompanyType {
//     return {
//         id: '',
//         // orderCount: 0,
//         // orderTotal: 0,
//         // phoneNumber: '',
//         stampTotal: 0, //총 스템프 적립 수
//         stampCount: 0, // 적립횟수
//         stampLast: 0, //마지막에 적립한
//         stampRemaining: 0, //남아있는...
//         couponRemaining: 0,
//         couponTotal: 0,
//         pointTotal: 0, //총 스템프 적립 수
//         pointCount: 0, // 적립횟수
//         pointLast: 0, //마지막에 적립한
//         pointRemaining: 0, //남아있는...      
//         shopPoint: 0,
//         shopMoney: 0,
//         orderTotalCount: 0,
//         orderTotalPrice: 0,
//         coupons: [],
//         dateMody: Timestamp.now(),
//         dateCreate: Timestamp.now(),
//     };
// }
