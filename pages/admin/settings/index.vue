<template>
    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">셋팅</h1>
      <p>관리자 설정 페이지입니다.</p>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path) {
  router.push(path); // 지정된 경로로 이동
}
</script>