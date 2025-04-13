import { COLLECTION_PERMISSIONS } from '@/shared-constants/collections'

/**
 * 버전 관리 대상이 되는 스토어 키
 */
export type VersionedStoreKey =
  | 'product'
  | 'category'
  | 'option'
  | 'optionGroup'

/**
 * 전체 스토어 키 (비버전 관리용 포함)
 */
export type StoreKey =
  | VersionedStoreKey
  | 'company'
  | 'user'
  | 'administrator'
  | 'order'
  | 'stampLog'
  | 'adminLog'
  | 'ordersWaiting'
  | 'counter'

/**
 * 버전 관리되는 스토어들의 공통 메타 정보 정의
 */
export const STORE_META: Record<VersionedStoreKey, {
  label: string
  storeId: string
  cacheKey: string
  collectionId: string
}> = {
  product: {
    label: '상품',
    storeId: 'product',
    cacheKey: 'product',
    collectionId: COLLECTION_PERMISSIONS.product.name, // 'products'
  },
  category: {
    label: '카테고리',
    storeId: 'category',
    cacheKey: 'category',
    collectionId: COLLECTION_PERMISSIONS.category.name, // 'categories'
  },
  option: {
    label: '옵션',
    storeId: 'option',
    cacheKey: 'option',
    collectionId: COLLECTION_PERMISSIONS.option.name, // 'options'
  },
  optionGroup: {
    label: '옵션 그룹',
    storeId: 'optionGroup',
    cacheKey: 'optionGroup',
    collectionId: COLLECTION_PERMISSIONS.optionGroup.name, // 'optionGroups'
  }
} as const
