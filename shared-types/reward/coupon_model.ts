// // coupon_model.ts

// import { Product } from '../../types/product/product';
// import { Timestamp, GeoPoint } from 'firebase/firestore'

// export type CouponModel = {
//     id: string; // 쿠폰 ID
//     idUser: string
//     idUserByPublisher: string,
//     isRequestUse: boolean; // 쿠폰 요청 사용 ID
//     dateRequestUse: Timestamp | null; // 생성 날짜
//     isCouponUsedLog: string[]; // 쿠폰 사용 로그
//     idOrderList: string[]; // 주문 ID 리스트
//     idProductList: string[]; // 상품 ID 리스트
//     idCompanyByPublisher: string; // 발행 회사 ID
//     availableStoreTypes: string[]; // 사용가능한 스토어 타입 발행처가 wooripoint인경우
//     availableBrandName: string; //사용 가능한 브랜드 행처가 wooripoint인경우
//     availableCompanies: string[]; //사용 가능한 회사 행처가 wooripoint인경우 , 혹은 체인점본사발행시 체인점들의 id들
//     creationRuleStampRequirement: number, //발행조건 스템프
//     creationRuleResetStampsAfterUse: boolean, //생성이후 스템프 리셋여부
//     creationRuleTotalStampCheck: boolean; // true: 전체 스탬프와 비교, false: 남아있는 스탬프와 비교
//     product?: Product | null; // 상품 모델, 필요 없을 경우 null
//     type: string; // 쿠폰 유형
//     nameEvent: string; // 이벤트 이름 (authentication UID)
//     nameCoupon: string; // 쿠폰 이름
//     pointRemaining: number; // 남아 있는 포인트
//     pointUse: number; // 마지막에 쓰고 있는 포인트 (계산상 필요해서 만들었는데 사실 없어져야할필드.)
//     pointUsed: number; // 사용된 포인트 총합
//     pointUsedByRequest: number; // 매장에서 사용요청하여 사용된 포인트
//     pointTotal: number; // 총 포인트
//     discountRate: number; //할인 쿠폰일 경우 pointTotal/discountRate 둘중하나만 해야함.
//     discountMaxPoint: number; // 최대 할인 금액 최대 5천원 이렇게..
//     qty: number; // 쿠폰 수량 수량은 거의 1로만 고정할 듯 없애도 될듯하지만 일단 놔둠.
//     isPossibleChange: boolean; // 교환 가능 여부
//     isPossibleSave: boolean; // 잔여 포인트 보관 여부 , false시 한번에 다써야함.
//     isOnlyWebOrder: boolean; //모바일에서만 주문 가능. 음..실효성 있을까?일단 필드는 만들고 활용x
//     memo: string; // 메모
//     dateCreateyyyy: number,
//     dateCreateyyyyMM: number,
//     dateCreateyyyyMMdd: number,
//     whereToUse: string; // 사용처
//     dateModified : Timestamp;
//     dateCreated: Timestamp; // 생성 날짜
//     dateExpiration: Timestamp | null; //기한만료일
//     dateUsed?: Timestamp | null; // 사용 날짜 (필요 없을 경우 null)
// };


// // 초기화 함수
// export function initializeCouponModel(): CouponModel {
//     const today = new Date();
//     const dateCreateyyyy = today.getFullYear();  // 2024
//     const dateCreateyyyyMM = (today.getFullYear() * 100) + (today.getMonth() + 1);  // 202412 (2024년 12월)
//     const dateCreateyyyyMMdd = (today.getFullYear() * 10000) + ((today.getMonth() + 1) * 100) + today.getDate();


//     return {
//         id: '',
//         idUser: '',
//         idUserByPublisher: '',
//         isRequestUse: false,
//         dateRequestUse: null,
//         isCouponUsedLog: [],
//         idOrderList: [],
//         idProductList: [],
//         idCompanyByPublisher: '',
//         availableStoreTypes: [],
//         availableBrandName: '',
//         availableCompanies: [],

//         creationRuleStampRequirement: 0,
//         creationRuleResetStampsAfterUse: false, // 안쓰겠는데? 제일 많은 쿠폰 발행 할때 초기화.
//         creationRuleTotalStampCheck: false,

//         product: null,
//         type: '',
//         nameEvent: '',
//         nameCoupon: '',
//         pointRemaining: 0,
//         pointUse: 0,
//         pointUsed: 0,
//         pointUsedByRequest: 0,
//         pointTotal: 0,
//         discountRate: 0,
//         discountMaxPoint: 0,
//         qty: 1,
//         isPossibleChange: false,
//         isPossibleSave: false,
//         isOnlyWebOrder: false,
//         memo: '',
//         dateCreateyyyy: dateCreateyyyy,
//         dateCreateyyyyMM: dateCreateyyyyMM,
//         dateCreateyyyyMMdd: dateCreateyyyyMMdd,
//         whereToUse: '',
//         dateModified : Timestamp.now(),
//         dateCreated: Timestamp.now(),
//         dateExpiration: null,
//         dateUsed: null
//     };
// }