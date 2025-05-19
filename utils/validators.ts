// 📁 utils/validators.ts

export function isValidPhoneNumber(number: string): boolean {
  return number.length === 13 && /^010-\d{4}-\d{4}$/.test(number)
}

export function isValidRewardAmount(type: 'stamp' | 'point', amount: number): boolean {
  if (type === 'stamp') return amount > 0 && amount <= 20
  if (type === 'point') return amount > 0 && amount <= 100000
  return false
}
