<template>
  <main class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">옵션 목록</h1>

    <!-- 로딩 표시 -->
    <div v-if="loading" class="text-center text-gray-500">옵션을 불러오는 중...</div>

    <!-- 에러 표시 -->
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- 옵션 목록 테이블 -->
    <div v-if="options.length > 0">
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="px-4 py-2">번호</th>
            <th class="px-4 py-2">진열순위</th>
            <th class="px-4 py-2">옵션명</th>
            <th class="px-4 py-2">타입</th>
            <th class="px-4 py-2">항목 수</th>
            <th class="px-4 py-2">수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(option, index) in options" :key="option.id" class="border-t">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ option.displayLevel }}</td>
            <td class="px-4 py-2">{{ option.optionName }}</td>
            <td class="px-4 py-2">{{ option.type }}</td>
            <td class="px-4 py-2">{{ option.optionItems?.length || 0 }}</td>
            
            <td class="px-4 py-2">
              <router-link
                :to="`/admin/option/edit/${option.id}`"
                class="text-blue-600 hover:underline"
              >
                수정
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 옵션이 없을 때 -->
    <div v-if="options.length === 0" class="text-center text-gray-500 mt-4">
      등록된 옵션이 없습니다.
    </div>

    <!-- 옵션 추가 버튼 -->
    <div class="mt-6 text-center">
      <router-link to="/admin/option/create" class="text-blue-600 hover:underline">
        옵션 추가하기
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Option } from '@/shared-types/option/option';
import { useOptionStore } from '@/stores/option/useOptionStore';

const optionStore = useOptionStore();

const options = ref<Option[]>([]);
const loading = ref(false);
const error = ref('');

// 옵션 목록 불러오기
async function loadOptions() {
  loading.value = true;
  error.value = '';
  try {
    await optionStore.fetchOptionsIfChanged();
    options.value = optionStore.options;
  } catch (err) {
    error.value = '옵션 목록을 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadOptions();
});
</script>

<style scoped>
/* 필요시 스타일 추가 */
</style>
