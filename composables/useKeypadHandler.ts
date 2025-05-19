// 📁 composables/useKeypadHandler.ts

import { ref } from 'vue'
import { isValidRewardAmount, isValidPhoneNumber } from '@/utils/validators'
import { useToast } from 'vue-toastification'

export function useRewardKeypadHandler(initial = '0', rewardType: 'stamp' | 'point') {
  const value = ref(initial)
  const toast = useToast()

  const handleClick = (key: string | number) => {
    if (key === '←') {
      value.value = value.value.slice(0, -1) || '0'
      return
    }

    if (key === '확인') {
      const amount = Number(value.value)
      if (!isValidRewardAmount(rewardType, amount)) {
        toast.error(
          rewardType === 'stamp'
            ? '스탬프는 1~20까지만 가능합니다.'
            : '포인트는 1~100,000까지만 가능합니다.'
        )
        value.value = '0'
        return
      }
    } else {
      value.value = value.value === '0' ? key.toString() : value.value + key.toString()
    }
  }

  return { value, handleClick }
}


export function usePhoneKeypadHandler(initial = '010-') {
  const phone = ref(initial)
  const toast = useToast()

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const handleClick = (key: string | number) => {
    if (key === '←') {
      const digits = phone.value.replace(/\D/g, '').slice(0, -1)
      phone.value = formatPhone(digits)
    } else if (key === '확인') {
      if (!isValidPhoneNumber(phone.value)) {
        toast.error('전화번호가 잘못되었습니다.')
        return false
      }
      return true
    } else {
      const digits = phone.value.replace(/\D/g, '') + key.toString()
      phone.value = formatPhone(digits)
    }

    return false
  }

  return { phone, handleClick }
}