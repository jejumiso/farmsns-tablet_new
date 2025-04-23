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
        <Keypad @keypadClick="handleKeypadClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import Keypad from '@/components/Keypad.vue'
import { createTabletSettingsService } from '@/services/tablet/tabletSettingsService'
const rewardAmount = ref('0')

const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()

const handleKeypadClick = async (key: string | number) => {
  if (key === '←') {
    rewardAmount.value = rewardAmount.value.slice(0, -1) || '0'
  } else if (key === '확인') {
    if (!rewardAmount.value || rewardAmount.value === '0') {
      alert('리워드 수량을 입력해주세요.')
      return
    }

    try {
      const companyId = authStore.company?.id
      const tabletNumber = Number(localStorage.getItem('tabletNumber'))
      const amount = Number(rewardAmount.value)

      if (!companyId || isNaN(tabletNumber)) throw new Error('회사 정보 또는 태블릿 번호가 유효하지 않습니다.')

      const service = createTabletSettingsService(companyId)
      const tabletId = `tablet_${tabletNumber}`

      var res = await service.saveItem({
        ...tabletSettingsStore.settings,
        pendingRewardAmount: 5
      })

      console.log('✅ API 호출 성공:', res)

      // 입력 후 초기화 (필요 시)
      rewardAmount.value = '0'
    } catch (err) {
      console.error('❌ API 호출 실패:', err)
      alert('적립 요청 중 오류가 발생했습니다.')
    }
  } else {
    // 숫자 입력
    rewardAmount.value = rewardAmount.value === '0' ? key.toString() : rewardAmount.value + key.toString()
    validateRewardAmount()
  }
}

const validateRewardAmount = () => {
  const { rewardType } = tabletSettingsStore.settings
  const amount = Number(rewardAmount.value)

  if (rewardType === 'stamp' && amount > 20) {
    alert('스탬프는 최대 20개까지만 가능합니다.')
    rewardAmount.value = '0'
  } else if (rewardType === 'point' && amount > 500000) {
    alert('포인트는 최대 500,000까지만 가능합니다.')
    rewardAmount.value = '0'
  } else if (amount <= 0 || isNaN(amount)) {
    alert('유효한 수량을 입력해주세요.')
    rewardAmount.value = '0'
  }
}
</script>

<style scoped>
/* Tailwind 스타일로 충분합니다 */
</style>
