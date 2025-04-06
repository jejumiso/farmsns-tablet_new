<template>
  <NuxtPage />
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/useAuthStore';

const authStore = useAuthStore();
authStore.initializeAuth(); // 앱 초기화 시 인증 상태 동기화
</script>

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