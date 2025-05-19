<!-- 📁 pages\tablet\reward-input-screen.vue -->
<template>
  <div class="flex h-screen">
    <!-- 왼쪽 섹션 -->
    <div class="w-1/2 bg-gray-100 flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4">셀프 적립</h1>
      <p class="text-lg text-gray-600 text-center">
        직원이 바쁘면 직접 적립을 해주세요. 감사합니다.
      </p>
    </div>

    <!-- 오른쪽 섹션 -->
    <div class="w-1/2 bg-white flex flex-col">
      <!-- 상단 40% -->
      <div class="flex-[4] flex flex-col justify-center items-center border-b border-gray-300">
        <h2 class="text-2xl font-semibold mb-4">셀프 적립 : 몇 잔 구매하셨나요?</h2>
        <div class="text-4xl font-black font-[montserrat]">
          {{ rewardAmount }}
        </div>
      </div>

      <!-- 하단 60% -->
      <div class="flex-[6]">
        <Keypad @keypadClick="handleKeypadClick" :isSubmitting="isSubmitting" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRewardKeypadHandler } from '@/composables/useKeypadHandler'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import Keypad from '@/components/Keypad.vue'
import { createTabletSettingsService } from '@/services/tablet/tabletSettingsService'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'

const toast = useToast()

const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()
const rewardType = tabletSettingsStore.settings.rewardType

// 커스텀 키패드 핸들러 사용
const { value: rewardAmount, handleClick: handleKeypadClickBase } = useRewardKeypadHandler('0', rewardType)
const isSubmitting = ref(false)
const handleKeypadClick = async (key: string | number) => {

    if (isSubmitting.value) return // 연타 방지

    


  if (key === '확인') {
    isSubmitting.value = true // 요청 시작
    if (!rewardAmount.value || rewardAmount.value === '0') {
      toast.success('리워드 수량을 입력해주세요.')
      isSubmitting.value = false // 요청 종료
      return
    }

    try {
      const companyId = authStore.company?.id
      const tabletNumber = Number(localStorage.getItem('tabletNumber'))
      const amount = Number(rewardAmount.value)

      if (!companyId || isNaN(tabletNumber)) throw new Error('회사 정보 또는 태블릿 번호가 유효하지 않습니다.')

      const service = createTabletSettingsService(companyId)

      await service.saveItem({
        ...tabletSettingsStore.settings,
        pendingRewardAmount: amount
      })

      console.log('✅ API 호출 성공: 적립 수량 저장 완료')
      rewardAmount.value = '0'
    } catch (err) {
      console.error('❌ API 호출 실패:', err)
      alert('적립 요청 중 오류가 발생했습니다.')
    } finally {
      isSubmitting.value = false // 요청 종료
    }
  } else {
    // 나머지 키는 기본 핸들러로 처리
    handleKeypadClickBase(key)
  }
}
</script>

<style scoped>
/* Tailwind 스타일로 충분합니다 */
</style>
