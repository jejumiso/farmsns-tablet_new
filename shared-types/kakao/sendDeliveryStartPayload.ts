// 📁 shared-types/kakao/sendDeliveryStartPayload.ts

export interface SendDeliveryStartPayload {
  companyId: string
  adminId: string
  securedSenderKey: string
  securedSender: string
  iv: string
  templateCode: string
  items: {
    phone: string
    invoices: InvoiceItem[]
  }[]
}


// 필수 필드 + 선택 필드를 포함한 송장 항목 구조
export interface InvoiceItem {
  courier: string        // 필수: 택배사
  invoice: string        // 필수: 송장번호
  productName?: string   // 선택: 상품명
  [key: string]: any     // 선택 필드 확장 가능 (예: 수량, 옵션 등)
}