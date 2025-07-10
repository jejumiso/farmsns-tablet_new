// 📁 services/super/adminUserService.ts
import { useApi } from '@/composables/useApi'
import type { Administrator } from '@/shared-types/administrator/administrator'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createAdminUserService() {
  const api = useApi()

  return {
    async getAll(): Promise<ApiResponse<Administrator[]>> {
      const res = await api.get<ApiResponse<Administrator[]>>('/api/super/administrators')
      return res.data
    },

    async delete(uid: string): Promise<ApiResponse<null>> {
      const res = await api.delete<ApiResponse<null>>(`/api/super/administrators/${uid}`)
      return res.data
    },

    async save(admin: Administrator): Promise<ApiResponse<Administrator>> {
      const res = await api.post<ApiResponse<Administrator>>(`/api/super/administrators`, admin)
      return res.data
    }
  }
}
