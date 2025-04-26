import CryptoJS from 'crypto-js'
import { fromBase64UrlSafe, toBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * @param encryptedUrlSafe   URL-safe Base64로 인코딩된 암호문
 * @param ivBase64           표준 Base64로 인코딩된 IV
 */
export function decryptWithIv(
  encryptedUrlSafe: string,
  ivBase64: string
): string {
  // URL-safe → 표준 Base64
  const base64Cipher = fromBase64UrlSafe(encryptedUrlSafe)

  // WordArray로 파싱
  const ciphertextWA = CryptoJS.enc.Base64.parse(base64Cipher)
  const ivWA         = CryptoJS.enc.Base64.parse(ivBase64)

  // 키 준비
  const keyWA = CryptoJS.enc.Utf8.parse(getEncryptionKey())

  // 복호화
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ciphertextWA })
  const decryptedWA  = CryptoJS.AES.decrypt(cipherParams, keyWA, {
    iv: ivWA,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return decryptedWA.toString(CryptoJS.enc.Utf8)
}
