/**
 * 컬렉션 이름을 포맷팅하는 함수
 * @param collectionName 변환할 컬렉션 이름
 * @returns 포맷된 컬렉션 이름
 */
export const formatCollectionName = (collectionName: string): string => {
    return collectionName.includes('_') ? collectionName.split('_')[1] : collectionName;
};
