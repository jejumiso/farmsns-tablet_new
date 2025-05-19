// 📁 composables/useKeypadHandler.ts

import { ref } from 'vue'
import { isValidRewardAmount, isValidPhoneNumber } from '@/utils/validators'
import { useToast } from 'vue-toastification'


export function useRewardKeypadHandler(initial = '0', rewardType: 'stamp' | 'point') {
  const value = ref(initial)
  const toast = useToast()

  const validateAndLimit = () => {
    const amount = Number(value.value)

    if (isNaN(amount) || amount <= 0) {
      toast.error('유효한 수량을 입력해주세요.')
      value.value = '0'
      return false
    }

    if (rewardType === 'stamp' && amount > 20) {
      toast.error('스탬프는 최대 20개까지만 가능합니다.')
      value.value = '0'
      return false
    }

    if (rewardType === 'point' && amount > 100000) {
      toast.error('포인트는 최대 100,000까지만 가능합니다.')
      value.value = '0'
      return false
    }

    return true
  }

  const handleClick = (key: string | number) => {
    if (key === '←') {
      value.value = value.value.slice(0, -1) || '0'
      return
    }

    if (key === '확인') {
      // 유효성은 외부에서 처리 (예: API 호출 전에)
      return validateAndLimit()
    }

    const newVal = value.value === '0' ? key.toString() : value.value + key.toString()
    value.value = newVal
    validateAndLimit()
  }

  return { value, handleClick }
}


export function usePhoneKeypadHandler(initial = '010-') {
  const phone = ref(initial)
  const toast = useToast()

  const formatPhone = (digits: string) => {
    // 항상 010-으로 시작
    digits = digits.replace(/\D/g, '').replace(/^010/, '')
    const head = '010'

    if (digits.length <= 4) {
      return `${head}-${digits}`
    } else {
      return `${head}-${digits.slice(0, 4)}-${digits.slice(4, 8)}`
    }
  }

  const handleClick = (key: string | number) => {
    const digitsOnly = phone.value.replace(/\D/g, '')

    if (key === '←') {
      const trimmed = digitsOnly.slice(0, -1)

      // 항상 최소 3자리 (010)는 유지
      if (trimmed.length < 3) {
        phone.value = '010-'
      } else {
        phone.value = formatPhone(trimmed)
      }

    } else if (key === '확인') {
      if (!isValidPhoneNumber(phone.value)) {
        toast.error('전화번호가 잘못되었습니다.')
        return false
      }
      return true

    } else {
      const nextDigits = digitsOnly + key.toString()
      if (nextDigits.length > 11) return false // 최대 11자리 (01012345678)

      phone.value = formatPhone(nextDigits)
    }

    return false
  }

  return { phone, handleClick }
}
