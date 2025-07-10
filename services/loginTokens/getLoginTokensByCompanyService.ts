import { collection, getDocs, query, where } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import type { LoginToken } from '@/shared-types/auth/loginToken'
import type { ApiResponse } from '@/shared-types/apiResponse'

export async function getLoginTokensByCompanyService(
  db: Firestore,
  companyId: string
): Promise<ApiResponse<LoginToken[]>> {
  return withFirestoreSafety(async () => {
    const q = query(collection(db, 'loginTokens'), where('companyId', '==', companyId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LoginToken))
  })
}

// utils/withFirestoreSafety.ts에 분리하는 것이 좋지만, 임시로 함께 정의
export async function withFirestoreSafety<T>(request: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await request()
    return {
      isSuccess: true,
      data,
    }
  } catch (error: any) {
    return {
      isSuccess: false,
      message: 'Firestore 요청 중 오류가 발생했습니다.',
      error: error?.message ?? 'Unknown error',
    }
  }
}
