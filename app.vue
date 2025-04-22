<!-- app.vue -->
<template>
    <NuxtPage />
</template>

<style scoped>
.logout-button {
background-color: #ef4444;
color: #ffffff;
padding: 0.5rem 1rem;
border: none;
border-radius: 4px;
font-size: 1rem;
cursor: pointer;
margin: 1rem 0;
transition: background-color 0.3s;
}

.logout-button:hover {
background-color: #dc2626;
}
</style>


<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { useTabletSettingsStore } from '@/stores/tablet/useTabletSettingsStore'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

const authStore = useAuthStore()
const tabletSettingsStore = useTabletSettingsStore()
const router = useRouter()
const route = useRoute()

watch(
  () => tabletSettingsStore.settings.pendingRewardAmount,
  (newValue, oldValue) => {
    console.log('[app.vue] pendingRewardAmount changed:', { oldValue, newValue })

    const s = tabletSettingsStore.settings
    console.log('실시간 테블릿 셋팅 값', newValue)
    console.log('실시간 테블릿 셋팅 값', s.useStandbyScreen)
    if (newValue === 0) {
      if (s.useStandbyScreen) {
        router.push('/tablet/standby-screen')
      } else if (s.useRewardInputScreen) {
        router.push('/tablet/reward-input-screen')
      } else if (s.usePhoneInputScreen) {
        router.push('/tablet/phone-input-screen')
      } else {
        console.warn('[app.vue] No valid screen configuration found.')
      }
    } else if (newValue > 0) {
      if (route.path !== '/tablet/phone-input-screen') {
        router.push('/tablet/phone-input-screen')
      }
    } else {
      console.warn('[app.vue] Invalid pendingRewardAmount value:', newValue)
    }
  },
  { immediate: true }
)
</script>
