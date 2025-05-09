// 📁 shared-types/coupon/userSummary.ts
export interface CouponUserSummary {
  uid: string;
  phoneSuffix: string;         // 예: 1234 (뒷자리)
  orderTotalCount: number;     
  stampCount: number;         
  pointCount: number;
  memoAdmin : string;
  recentOrderDate?: string;    // 최근 주문일 (ISO 문자열)
}
