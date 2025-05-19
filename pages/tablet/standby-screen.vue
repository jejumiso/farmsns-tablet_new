<!-- 📁 pages\tablet\standby-screen.vue -->
<template>
  <div
    class="flex h-screen"
    @click="handleScreenClick"
  >
    <!-- 왼쪽 섹션 -->
    <div class="w-1/2 flex justify-center items-center bg-gray-100">
      <img
        src="/assets/imgs/kakao_c.png"
        alt="카카오 이미지"
        class="w-[90%] h-auto"
      />
    </div>

    <!-- 오른쪽 섹션 -->
    <div class="w-1/2 flex flex-col justify-center items-center bg-white">
      <p class="text-lg mb-4">적립 내역 카톡으로 전송 완료</p>
      <p class="text-2xl font-bold mb-2">카톡채널 추가하고</p>
      <p class="text-2xl font-bold mb-2">카톡에서 주문하면</p>
      <div class="flex items-center justify-center text-2xl font-bold">
        <span>적립 </span>
        <span class="text-red-500">3배</span>
        <span> 혜택</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

// 스토어와 라우터 가져오기
const router = useRouter()

// tabletSettings를 반응형으로 가져오기
// ✅ 올바른 코드
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
const tabletSettingsStore = useTabletSettingsStore()
const tabletSettings = computed(() => tabletSettingsStore.settings)

// 화면 클릭 핸들러
const handleScreenClick = () => {
  const { useRewardInputScreen, usePhoneInputScreen } = tabletSettings.value

  if (useRewardInputScreen) {
    router.push('/tablet/reward-input-screen') // 리워드 입력 화면으로 이동
  } else if (usePhoneInputScreen) {
    router.push('/tablet/phone-input-screen') // 핸드폰 번호 입력 화면으로 이동
  } else {
    console.log('화면 이동 조건이 충족되지 않았습니다.')
  }
}
</script>