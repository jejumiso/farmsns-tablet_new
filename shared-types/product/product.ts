// types/product/product.ts
import { Timestamp } from 'firebase/firestore'
import type { DocumentMeta } from '../common/documentMeta'

export interface Product {
  id: string
  idHeaderProduct: string
  isHeadData: boolean
  categories: string[]
  isHiddenProduct: boolean
  productName: string
  productNameShort: string
  priceOri: number
  priceShort: string
  priceSale: number
  imgUrl: string
  unit: string
  explanation: string
  stockStatus: boolean
  isDisplay: boolean
  displayLevel: number
  specialPrice: number
  specialUsedQty: number
  optionGroupId: string
  optionGroupName?: string
  optionIds: string[]
  rewardStamp: number
  rewardPoint: number
  dateCreated: Timestamp | null
  dateModified: Timestamp | null
  docId : string
}



// ✅ 기본값 생성 함수
export function createEmptyProduct(): Product {
  return {
    id: '',
    idHeaderProduct: '',
    isHeadData: false,
    categories: [],
    isHiddenProduct: false,
    productName: '',
    productNameShort: '',
    priceOri: 0,
    priceShort: '',
    priceSale: 0,
    imgUrl: '',
    unit: '',
    explanation: '',
    stockStatus: false,
    isDisplay: false,
    displayLevel: 0,
    specialPrice: 0,
    specialUsedQty: 0,
    optionGroupId: '',
    optionGroupName: undefined,
    optionIds: [],
    rewardStamp: 0,
    rewardPoint: 0,
    dateCreated: null,
    dateModified: null,
    docId : '',
  }
}

export interface ProductState {
  products: Product[]
  documents: DocumentMeta[]
  loading: boolean
  error: string | null
}

