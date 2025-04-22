export function generateRandomIv(): string {
  const array = crypto.getRandomValues(new Uint8Array(16));
  const b64 = btoa(String.fromCharCode(...array));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
