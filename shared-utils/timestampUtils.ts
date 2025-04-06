// // Firestore Timestamp 타입 정의
// export type FirestoreTimestamp = {
//     _seconds: number;
//     _nanoseconds: number;
// };

// /**
//  * Firestore Timestamp를 Date 객체로 변환
//  * @param timestamp FirestoreTimestamp
//  * @returns Date 객체
//  */
// const firestoreTimestampToDate = (timestamp: FirestoreTimestamp): Date => {
//     return new Date(timestamp._seconds * 1000); // 초를 밀리초로 변환
// };

// /**
//  * Date 객체를 "yy년 mm월 dd일" 형식으로 변환
//  * @param date Date 객체
//  * @returns "yy년 mm월 dd일" 형식의 문자열
//  */
// const formatDateToKoreanFromDate = (date: Date): string => {
//     const year = date.getFullYear().toString().slice(-2); // 마지막 두 자리
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 1월 = 0이므로 +1
//     const day = date.getDate().toString().padStart(2, '0'); // 날짜가 한 자리수일 경우 앞에 0 추가
//     return `${year}년 ${month}월 ${day}일`;
// };

// /**
//  * Firestore Timestamp를 바로 "yy년 mm월 dd일" 형식으로 변환
//  * @param timestamp FirestoreTimestamp
//  * @returns "yy년 mm월 dd일" 형식의 문자열
//  */
// export const formatDateToKorean = (timestamp: FirestoreTimestamp): string => {
//     const date = firestoreTimestampToDate(timestamp);
//     return formatDateToKoreanFromDate(date);
// };
