<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">카테고리 목록</h1>

    <div class="flex justify-end mb-4">
      <NuxtLink to="/admin/category/create" class="px-4 py-2 bg-blue-600 text-white rounded">
        + 새 카테고리 추가
      </NuxtLink>
    </div>

    <table class="w-full table-auto border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">이름</th>
          <th class="p-2 border">표시 순서</th>
          <th class="p-2 border">작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categoryStore.categories" :key="category.id">
          <td class="p-2 border">{{ category.categoryName }}</td>
          <td class="p-2 border">{{ category.displayLevel }}</td>
          <td class="p-2 border text-center">
            <NuxtLink :to="`/admin/category/edit/${category.id}`" class="text-blue-600 hover:underline">
              수정
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCategoryStore } from '@/stores/category/categoryStore';
onMounted(() => useCategoryStore().fetchCategoriesIfChanged());
const categoryStore = useCategoryStore();
</script>
