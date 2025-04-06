import { getEncryptionKey, getEncryptionIv } from '../../env';



//utils/encryption.ts
import { fromBase64UrlSafe, toBase64UrlSafe } from "./utils";

// const CryptoJS = require('crypto-js');
import CryptoJS from 'crypto-js';



// 암호화 함수
export function encryptAndUrlSafe(data: string, key: string, iv: string): string {
    const encryptionKey = CryptoJS.enc.Utf8.parse(key);
    const encryptionIV = CryptoJS.enc.Utf8.parse(iv);

    const encrypted = CryptoJS.AES.encrypt(data, encryptionKey, {
        iv: encryptionIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const base64 = encrypted.toString(); // 일반 base64로 인코딩된 암호화 결과
    return toBase64UrlSafe(base64);      // URL-safe Base64로 변환
}

// 복호화 함수
export function decryptData(encryptedText: string, key: string, iv: string): string {
    const decryptionKey = CryptoJS.enc.Utf8.parse(key);
    const decryptionIV = CryptoJS.enc.Utf8.parse(iv);

    // URL-safe Base64 -> 일반 Base64로 복원
    const base64 = fromBase64UrlSafe(encryptedText);

    try {
        const decrypted = CryptoJS.AES.decrypt(base64, decryptionKey, {
            iv: decryptionIV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error instanceof Error ? error.message : error);
        return '';
    }
}


// 암호화 함수
export function encryptAndUrlSafe2(data: string): string {
    const key = getEncryptionKey();
    const iv = getEncryptionIv();

    if (!key || !iv) {
        throw new Error('Encryption key or IV is not defined.');
    }

    const encryptionKey = CryptoJS.enc.Utf8.parse(key);
    const encryptionIV = CryptoJS.enc.Utf8.parse(iv);

    const encrypted = CryptoJS.AES.encrypt(data, encryptionKey, {
        iv: encryptionIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const base64 = encrypted.toString(); // 일반 base64로 인코딩된 암호화 결과
    return toBase64UrlSafe(base64);      // URL-safe Base64로 변환
}


export function decryptData2(encryptedText: string): string {
    if (!encryptedText) {
        console.warn('decryptData2: 암호화된 텍스트가 전달되지 않았습니다.');
        return '';
    }

    const key = getEncryptionKey();
    const iv = getEncryptionIv();

    if (!key || !iv) {
        throw new Error('Encryption key or IV is not defined.');
    }


    const decryptionKey = CryptoJS.enc.Utf8.parse(key);
    const decryptionIV = CryptoJS.enc.Utf8.parse(iv);

    // URL-safe Base64 -> 일반 Base64로 복원 (입력이 유효한지 확인)
    const base64 = fromBase64UrlSafe(encryptedText);

    try {
        const decrypted = CryptoJS.AES.decrypt(base64, decryptionKey, {
            iv: decryptionIV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error instanceof Error ? error.message : error);
        return '';
    }
}
