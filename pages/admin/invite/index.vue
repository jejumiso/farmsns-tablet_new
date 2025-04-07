<template>
    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">초대</h1>
      <p>사용자를 초대하는 페이지입니다.</p>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function navigateTo(path) {
  router.push(path); // 지정된 경로로 이동
}

async function handleLogout() {
  try {
    await authStore.logout(); // 로그아웃 처리
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
</script>