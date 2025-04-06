//utils.ts
export function toBase64UrlSafe(base64: string): string {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// URL-safe Base64를 일반 Base64로 복원하는 함수
export function fromBase64UrlSafe(base64UrlSafe: string): string {
    let base64 = base64UrlSafe.replace(/-/g, '+').replace(/_/g, '/');

    // 길이가 4의 배수가 되도록 `=` 패딩 추가
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }

    return base64;
}