<script setup lang="ts">
import { useRouter } from 'vue-router';
import {  onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  router.push('/admin'); // 관리자 최상단 페이지로 리다이렉트
});
</script>

<template>
  <div></div>
</template>

<style>
</style>
