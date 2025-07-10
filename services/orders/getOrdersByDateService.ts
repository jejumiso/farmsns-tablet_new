// 📁 services/orders/getOrdersByDateService.ts
import type { Order, OrderToSave } from '@/shared-types/order/order'
import type { ApiResponse } from '@/shared-types/apiResponse'
import { withApiSafety } from '@/utils/withApiSafety'
import { useApi } from '@/composables/useApi'

export async function getOrdersByDateService(companyId: string,uid:string, searchDate: number): Promise<ApiResponse<OrderToSave[]>> {
  return withApiSafety(() =>
    useApi().get<ApiResponse<OrderToSave[]>>('/api/orders/listByDate', {
      params: {
        companyId,
        uid,
        searchDate, // 예: '2025-05-03'
      },
    })
  )
}



/**
 * 관리자용 주문 조회: uid 없이 companyId + searchDate 기준으로 조회
 */
export async function getOrdersByDateAdminService(companyId: string, searchDate: number): Promise<ApiResponse<OrderToSave[]>> {
  return withApiSafety(() =>
    useApi().get<ApiResponse<OrderToSave[]>>('/api/orders/listByDateAdmin', {
      params: {
        companyId,
        searchDate,
      },
    })
  )
}