// types/common/defaultTimestampKeys.ts

/**
 * 응답에서 Timestamp 변환이 필요한 공통 키 목록
 */
export const defaultTimestampKeys = [
    'dateCreated',
    'dateModified',
    'dateDeleted',
    'datePublished',
    'dateExpired',
    'dateStart',
    'dateEnd',
    'dateLastLogin',
    'dateLastAccess',
    'dateApproved',
    'dateActivated',
    'dateDeactivated',
    'dateSynced'
  ] as const
  
  