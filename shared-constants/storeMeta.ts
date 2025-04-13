
import { COLLECTION_PERMISSIONS } from './collections'

// 동일한 StoreKey 사용
export type StoreKey = keyof typeof COLLECTION_PERMISSIONS

/**
 * StoreMeta:
 * 프론트엔드(Pinia 스토어) 관련 정보들을 정의합니다.
 * 각 키는 하나의 "스토어"에 해당합니다.
 * 각 스토어는 COLLECTION_PERMISSIONS에서 정의된 권한을 기반으로 합니다.
 * 각 스토어의 메타 정보는 COLLECTION_PERMISSIONS에서 정의된 내용을 기반으로 생성됩니다.
 */
export const STORE_META: Record<
  StoreKey,
  {
    label: string
    storeId: string
    cacheKey: string
    collectionId: string
  }
> = Object.fromEntries(
  Object.entries(COLLECTION_PERMISSIONS).map(([key, value]) => [
    key,
    {
      label: value.key, // 필요 시 사용자 친화적 라벨로 수정 가능
      storeId: value.key,
      cacheKey: value.key,
      collectionId: value.name,
    },
  ])
) as Record<StoreKey, {
  label: string
  storeId: string
  cacheKey: string
  collectionId: string
}>
