<template>
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- 옵션 그룹명 -->
      <div>
        <label for="optionGroupName" class="block text-sm font-medium text-gray-700">옵션 그룹명</label>
        <input
          v-model="optionGroup.optionGroupName"
          type="text"
          id="optionGroupName"
          class="w-full mt-2 p-2 border rounded"
          required
        />
      </div>
  
      <!-- 옵션 ID 목록 (쉼표로 입력) -->
      <div>
        <label for="optionIds" class="block text-sm font-medium text-gray-700">옵션 ID 목록</label>
        <input
          v-model="optionIdsInput"
          type="text"
          id="optionIds"
          class="w-full mt-2 p-2 border rounded"
          placeholder="예: opt1,opt2,opt3"
        />
      </div>
  
      <!-- 저장 버튼 -->
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ isEditMode ? '수정' : '추가' }}하기
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { OptionGroup } from '@/shared-types/option/optionGroup';
  
  const props = defineProps<{
    optionGroup: OptionGroup;
    isEditMode: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'submit', value: OptionGroup): void;
  }>();
  
  // 옵션 ID 입력값을 문자열로 처리
  const optionIdsInput = ref(props.optionGroup.optionIds.join(','));
  
  // optionIdsInput 값이 바뀔 때 optionGroup.optionIds 도 동기화
  watch(optionIdsInput, (value) => {
    props.optionGroup.optionIds = value
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id);
  });
  
  const submitForm = () => {
    emit('submit', props.optionGroup);
  };
  </script>
  