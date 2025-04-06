// category.ts

export interface Category {
    id: string
    categoryName: string
    displayLevel: number
    isHeadData: boolean
    originaCompanyId: string
  }
  
  // 기본값 생성 함수
  export const createEmptyCategory = (): Category => ({
    id: '',
    categoryName: '',
    displayLevel: 100,
    isHeadData: false,
    originaCompanyId: ''
  })
  