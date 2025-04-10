<template>
  <main class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">카테고리 목록</h1>

    <!-- 로딩 표시 -->
    <div v-if="loading" class="text-center text-gray-500">카테고리를 불러오는 중...</div>

    <!-- 에러 표시 -->
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- 카테고리 목록 테이블 -->
    <div v-if="categories.length > 0">
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="px-4 py-2">번호</th>
            <th class="px-4 py-2">진열순위</th>
            <th class="px-4 py-2">카테고리명</th>
            <th class="px-4 py-2">상속</th>
            <th class="px-4 py-2">수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in categories" :key="category.id" class="border-t">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ category.displayLevel }}</td>
            <td class="px-4 py-2">{{ category.categoryName }}</td>
            <td class="px-4 py-2">
              {{ category.useParentData ? '사용' : '미사용' }}
            </td>
            <td class="px-4 py-2">
              <router-link
                :to="`/admin/category/edit/${category.id}`"
                class="text-blue-600 hover:underline"
              >
                수정
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 카테고리가 없을 때 -->
    <div v-if="categories.length === 0 && !loading" class="text-center text-gray-500 mt-4">
      등록된 카테고리가 없습니다.
    </div>

    <!-- 추가 버튼 -->
    <div class="mt-6 text-center">
      <router-link to="/admin/category/create" class="text-blue-600 hover:underline">
        카테고리 추가하기
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCategoryStore } from '@/stores/category/categoryStore';
import type { Category } from '@/shared-types/category/category';

const categoryStore = useCategoryStore();

const categories = ref<Category[]>([]);
const loading = ref(false);
const error = ref('');

// 카테고리 목록 불러오기
async function loadCategories() {
  loading.value = true;
  error.value = '';
  try {
    await categoryStore.fetchCategoriesIfChanged();
    categories.value = categoryStore.categories;
  } catch (err) {
    error.value = '카테고리 목록을 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
/* 필요 시 추가 스타일 */
</style>
