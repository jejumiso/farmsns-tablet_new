<!-- tablet/index.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-yellow-100">
      <div class="bg-white p-8 rounded-lg shadow-md text-center space-y-6 max-w-md w-full">
        <h1 class="text-3xl font-bold text-yellow-500">테블릿 초기화 중...</h1>
        <div v-if="tabletSettings?.pendingRewardAmount !== undefined" class="text-gray-700 space-y-2">
          <p>📦 적립 대기 수량: <strong>{{ tabletSettings.pendingRewardAmount }}</strong></p>
          <p>🎯 적립 타입: <strong>{{ tabletSettings.rewardType }}</strong></p>
        </div>
        <div v-else class="text-gray-500 italic">테블릿 설정을 불러오는 중입니다...</div>
        <div class="text-sm text-gray-400">※ 설정값에 따라 자동으로 화면이 전환됩니다.</div>
  
        <button @click="logout"
                class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
          로그아웃
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth/useAuthStore'
  import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const authStore = useAuthStore()
  const tabletSettingsStore = useTabletSettingsStore()
  const tabletSettings = computed(() => tabletSettingsStore.settings)
    const logout = () => {
    authStore.logout()
    setTimeout(() => {
      router.push('/tablet/login')
    }, 100) // ✅ 미들웨어가 auth 상태 갱신을 반영할 시간 확보
  }

  </script>
  