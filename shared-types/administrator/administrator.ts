import { Timestamp } from 'firebase-admin/firestore'

// 'registered' → 회원가입 완료 (아직 승인 요청 전)
// 'pending_approval' → 가입 후 승인 요청한 상태
// 'active' → 정상적으로 로그인 가능
// 'inactive' → 비활성화된 계정
// 'suspended' → 일정 기간 정지된 계정
// 'deleted' → 탈퇴 처리된 계정
export type RoleType = 'super' | 'admin' // ✅ 가능한 값만 지정

export interface Administrator {
  id: string
  token: string
  idCompany: string
  companyId: string
  email: string
  username: string
  resPhoneNumber: string
  resPhoneNumber2: string
  phoneNumber: string
  phoneNumber2: string
  roles: RoleType[]
  companyIds: string[]
  status: 'new' | 'registered' | 'pending_approval' | 'active' | 'inactive' | 'suspended' | 'deleted'
  userSignupMethod: '' | 'phone' | 'email' | 'kakao'
  userAuthIdentifier: string
  dateCreated: Timestamp | null
  dateModified: Timestamp | null
}

// 회사 가입 시 빈 값을 생성하는 함수
export function createEmptyAdministrator(): Administrator {
  return {
    id: '',
    token: '',
    idCompany: '',
    companyId: '',
    email: '',
    username: '',
    resPhoneNumber: '',
    resPhoneNumber2: '',
    phoneNumber: '',
    phoneNumber2: '',
    roles: [],
    companyIds: [],
    status: 'new',
    userSignupMethod: '',
    userAuthIdentifier: '',
    dateCreated: null,
    dateModified: null
  }
}
