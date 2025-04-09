<template>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">카테고리명</label>
        <input
          v-model="category.categoryName"
          type="text"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">표시 순서</label>
        <input
          v-model.number="category.displayLevel"
          type="number"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </div>
  
      <div class="flex justify-between pt-4">
        <button
          v-if="isEditMode"
          type="button"
          @click="$emit('delete')"
          class="px-4 py-2 bg-red-500 text-white rounded"
        >
          삭제하기
        </button>
  
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ isEditMode ? '수정' : '추가' }}하기
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import type { Category } from '@/shared-types/category/category';
  
  const props = defineProps<{
    category: Category;
    isEditMode: boolean;
  }>();
  const emit = defineEmits<{
    (e: 'submit', category: Category): void;
    (e: 'delete'): void;
  }>();
  
  const submitForm = () => {
    emit('submit', props.category);
  };
  </script>