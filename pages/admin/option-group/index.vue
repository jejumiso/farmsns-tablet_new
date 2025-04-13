<template>
  <main class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">옵션 그룹 목록</h1>

    <div v-if="loading" class="text-center text-gray-500">옵션 그룹을 불러오는 중...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-if="optionGroups.length > 0">
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="px-4 py-2">번호</th>
            <th class="px-4 py-2">옵션 그룹명</th>
            <th class="px-4 py-2">옵션 개수</th>
            <th class="px-4 py-2">수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(group, index) in optionGroups" :key="group.id" class="border-t">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ group.optionGroupName }}</td>
            <td class="px-4 py-2">{{ group.optionIds.length }}</td>
            <td class="px-4 py-2">
              <router-link :to="`/admin/option-group/edit/${group.id}`" class="text-blue-600 hover:underline">수정</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="optionGroups.length === 0" class="text-center text-gray-500 mt-4">옵션 그룹이 없습니다.</div>

    <div class="mt-6 text-center">
      <router-link to="/admin/option-group/create" class="text-blue-600 hover:underline">옵션 그룹 추가하기</router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore';
import type { OptionGroup } from '@/shared-types/option/optionGroup';

const optionGroupStore = useOptionGroupStore;

const optionGroups = computed(() => optionGroupStore.items);

const loading = ref(false);
const error = ref('');

// const loadOptionGroups = async () => {
//   loading.value = true;
//   try {
//     optionGroups.value = optionGroupStore.optionGroups;
//   } catch (err) {
//     error.value = '옵션 그룹 목록을 불러오는 데 실패했습니다.';
//   } finally {
//     loading.value = false;
//   }
// };

onMounted(() => {
  // loadOptionGroups();
});
</script>
