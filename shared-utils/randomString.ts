/**
 * 랜덤 문자열을 생성하는 함수
 * @param length 생성할 문자열의 길이 (기본값: 5)
 * @returns 생성된 랜덤 문자열
 */
export const generateRandomString = (length: number = 5): string => {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};
