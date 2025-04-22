<!-- layouts/default.vue -->
<template>
  <div class="flex h-screen">
    <!-- 사이드바 -->
    <SidebarMenu @navigate="navigateTo" />

    <!-- 메인 콘텐츠 -->
    <main class="flex-1 bg-gray-100 p-6 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';

const router = useRouter();

function navigateTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
/* 필요한 경우 추가 스타일 작성 가능 */
</style>
