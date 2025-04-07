<template>
    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">옵션</h1>
      <p>여기는 옵션 목록을 보여주는 페이지입니다</p>
      <!-- 나중에 개발할 예정 -->
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path) {
  router.push(path); // 지정된 경로로 이동
}
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>
