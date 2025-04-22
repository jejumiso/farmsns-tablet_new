<template>
  <div class="flex h-screen">
    <!-- 왼쪽 섹션 -->
    <div class="w-1/2 bg-gray-100 flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4" @click="handleTitleClick">스탬프 적립</h1>
      <p class="text-lg text-gray-600 text-center">
        입력하신 번호로 적립내역을<br />카카오톡 메시지로 보내드립니다.
      </p>
    </div>

    <!-- 오른쪽 섹션 -->
    <div class="w-1/2 bg-white flex flex-col">
      <!-- 상단 40% -->
      <div class="flex-[4] flex flex-col justify-center items-center border-b border-gray-300">
        <h2 class="text-2xl font-semibold mb-4">핸드폰 번호를 입력해주세요</h2>
        <div class="text-4xl font-black font-[montserrat]">
          {{ formattedPhoneNumber }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import Keypad from '@/components/Keypad.vue'
import { convertToKoreanPhoneNumber } from '@/utils/common/common'
import { encryptWithIv } from '@/shared-utils/crypto/encryption'
import { type PointSave } from '@/shared-types/reward/pointSave'
import { Timestamp } from 'firebase/firestore'
import type { KakaoAlimTemplate } from '~/shared-types/kakao/templateResponse'

const router = useRouter()
const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()

const phoneNumber = ref('010-')
const formattedPhoneNumber = computed(() => convertToKoreanPhoneNumber(phoneNumber.value))
const clickCount = ref(0)
const iv = authStore.company?.iv;

// 🎧 안내 음성
watch(
  () => tabletSettingsStore.settings.pendingRewardAmount,
  (newValue) => {
    if (newValue > 0 && window.FlutterChannel) {
      window.FlutterChannel.postMessage(JSON.stringify({
        action: 'playAudio',
        fileName: 'phone_input_instruction'
      }))
    }
  }
)

const handleKeypadClick = async (key: string | number) => {
 
}

const handleTitleClick = () => {
  clickCount.value++
  if (clickCount.value === 10) {
    alert('로그아웃됩니다.')
    authStore.logout()
    router.push('/tablet/login')
  }
}

onMounted(() => {
  clickCount.value = 0
})
</script>

<style scoped>
/* Tailwind CSS로 충분합니다 */
</style>
