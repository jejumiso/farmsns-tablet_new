<!--tablet/index.vue-->
<template>
    <div>
        <h1>Tablet Settings</h1>
        <div v-if="tabletSettings?.pendingRewardAmount !== undefined">
            <p>Pending Reward Amount: {{ tabletSettings.pendingRewardAmount }}</p>
            <p>Reward Type: {{ tabletSettings.rewardType }}</p>
            <!-- 다른 필드들도 필요에 따라 표시 -->
        </div>
        <div v-else>
            <p>Loading tablet settings...</p>
        </div>
        <!-- 로그아웃 버튼 추가 -->
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '~/stores/tablet/useTabletSettingsStore'
  const tabletSettingsStore = useTabletSettingsStore()
  import { computed } from 'vue'
  

const authStore = useAuthStore()
const tabletSettings = computed(() => tabletSettingsStore.settings)
// 로그아웃 함수
const logout = () => {
    authStore.logout()
}
</script>