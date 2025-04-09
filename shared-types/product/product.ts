// types/product/product.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
import type {  DocumentMetaOnly } from '../common/documentMeta'

export interface Product {
  id: string
  companyId: string
  parentProductId: string
  useParentData: boolean
  categories: string[]
  isHiddenProduct: boolean
  productName: string
  productNameShort: string
  priceOri: number
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
    companyId: '',
    parentProductId: '',
    useParentData: false,
    categories: [],
    isHiddenProduct: false,
    productName: ' 상품이름',
    productNameShort: '',
    priceOri: 0,
    priceSale: 0,
    imgUrl: '이미지url',
    unit: '',
    explanation: '상품설명',
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
  documents: DocumentMetaOnly[]
  dateLastFetched: number     // ✅ 새로 추가
  loading: boolean
  error: string | null
}

