import { generateRandomString } from './randomString';
import { formatCollectionName } from './formatCollectionName';

/**
 * 숫자를 지정된 자릿수로 앞에 0을 채워 문자열로 변환하는 함수
 * @param num 변환할 숫자
 * @param size 원하는 자릿수
 * @returns 0이 채워진 문자열
 */
const padWithZeroes = (num: number, size: number): string => {
    let numStr = num.toString();
    while (numStr.length < size) {
        numStr = '0' + numStr;
    }
    return numStr;
};

/**
 * Firestore 문서 ID를 생성하는 함수
 * @param companyId 회사ID
 * @param collectionCount 현재 컬렉션의 문서 개수
 * @param collectionName 컬렉션 이름
 * @returns 생성된 문서 ID
 */
export const generateDocumentId = (companyId: string, collectionCount: number, collectionName: string): string => {
    const paddedCount = padWithZeroes(collectionCount, 6); // collectionCount를 5자리로 변환
    const randomString = generateRandomString(4);
    return `${paddedCount}_${companyId}_${formatCollectionName(collectionName)}_${randomString}`;
};

export const generateDocumentId2 = (companyId: string, generateRandom: number,): string => {
    const randomString = generateRandomString(generateRandom);
    // 현재 시간을 포맷: 년월일시분초밀리초 (YYYYMMDDHHMMSSmmm)
    const now = new Date();
    const formattedDate = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`;

    return `${companyId}_${formattedDate}_${randomString}`;
};
