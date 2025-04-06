// import { Timestamp, GeoPoint } from 'firebase/firestore'

// // 회사 가입 시 요청 모델: 가입 후에는 사용되지 않음
// export interface CompanyRegister {
//   id: string
//   ceoName: string
//   shopName: string
//   phoneNumber: string
//   postCode: string
//   address: string         // 주소
//   addressDetail: string   // 상세주소
//   extraAddr: string       // 도로명 참고 항목
//   geoLatitude: number
//   geoLongitude: number
//   geoPoint: GeoPoint
//   geoHash: string
//   dateCreated: Timestamp
//   dateModified: Timestamp
//   companyId: string
//   isHeadCompany: boolean
// }

// // 회사 가입 시 빈 값을 생성하는 함수
// export function createEmptyCompanyRegister(): CompanyRegister {
//   return {
//     id: '',
//     ceoName: '',
//     shopName: '',
//     phoneNumber: '',
//     postCode: '',
//     address: '',
//     addressDetail: '',
//     extraAddr: '',
//     geoLatitude: 0,
//     geoLongitude: 0,
//     geoPoint: new GeoPoint(0, 0),
//     geoHash: '',
//     dateCreated: Timestamp.now(),
//     dateModified: Timestamp.now(),
//     companyId: '',
//     isHeadCompany: false
//   }
// }
