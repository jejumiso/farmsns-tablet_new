// delivery_cost_model.ts

export interface DeliveryCost {
    basicCost: number
    basicM: number
    addCost: number
    addM: number
    supportStrCost: string
  }
  
  // 기본값 생성 함수
  export const createEmptyDeliveryCost = (): DeliveryCost => ({
    basicCost: 0,
    basicM: 0,
    addCost: 0,
    addM: 0,
    supportStrCost: '',
  })
  