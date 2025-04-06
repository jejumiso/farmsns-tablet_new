// import { Timestamp } from 'firebase/firestore';

// /**
//  * Firestore Timestamp, Date 객체, 또는 { _seconds, _nanoseconds } 객체를 "yy년 mm월 dd일" 형식으로 변환
//  * @param input Firestore Timestamp 객체, Date 객체 또는 { _seconds, _nanoseconds } 형태의 객체
//  * @returns 변환된 날짜 문자열
//  */
// export const formatDateToKorean = (
//     input: Timestamp | Date | { _seconds: number; _nanoseconds: number } | null | undefined
// ): string => {
//     if (!input) {
//         return ''; // 입력이 없으면 빈 문자열 반환
//     }

//     let date: Date;

//     // Firestore Timestamp 처리
//     if (input instanceof Timestamp) {
//         date = input.toDate();
//     }
//     // Date 객체 처리
//     else if (input instanceof Date) {
//         date = input;
//     }
//     // { _seconds, _nanoseconds } 객체 처리
//     else if ('_seconds' in input && '_nanoseconds' in input) {
//         const timestamp = new Timestamp(input._seconds, input._nanoseconds);
//         date = timestamp.toDate();
//     } else {
//         console.error('Invalid date format:', input);
//         return ''; // 잘못된 입력 처리
//     }

//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');

//     return `${year}년 ${month}월 ${day}일`;
// };


// export const formatTimeToKorean2 = (
//     input: Timestamp | Date | { _seconds: number; _nanoseconds: number } | null | undefined
// ): string => {
//     if (!input) {
//         return ''; // 입력이 없으면 빈 문자열 반환
//     }

//     let date: Date;

//     // Firestore Timestamp 처리
//     if (input instanceof Timestamp) {
//         date = input.toDate();
//     }
//     // Date 객체 처리
//     else if (input instanceof Date) {
//         date = input;
//     }
//     // { _seconds, _nanoseconds } 객체 처리
//     else if ('_seconds' in input && '_nanoseconds' in input) {
//         const timestamp = new Timestamp(input._seconds, input._nanoseconds);
//         date = timestamp.toDate();
//     } else {
//         console.error('Invalid date format:', input);
//         return ''; // 잘못된 입력 처리
//     }

//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');

//     return `${hours}시 ${minutes}분`;
// };


// export function isWithinDays(timestamp: any, days: number): boolean {
//     if (!timestamp) {
//         console.error("timestamp가 제공되지 않았습니다.");
//         return false;
//     }

//     let date: Date;

//     // Firestore Timestamp 객체라면 toDate() 메서드가 존재하거나, _seconds 프로퍼티를 사용할 수 있음
//     if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
//         date = timestamp.toDate();
//     } else if (timestamp._seconds !== undefined) {
//         date = new Date(timestamp._seconds * 1000);
//     } else {
//         date = new Date(timestamp);
//     }

//     if (isNaN(date.getTime())) {
//         console.error("유효한 날짜가 아닙니다:", timestamp);
//         return false;
//     }

//     const now = new Date();
//     const diffMilliseconds = now.getTime() - date.getTime();
//     const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);
//     return diffDays >= 0 && diffDays <= days;
// }
