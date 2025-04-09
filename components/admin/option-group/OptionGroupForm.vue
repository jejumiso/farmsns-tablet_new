<template>
  <div class="flex gap-6">
    <!-- 왼쪽: 그룹 정보 입력 -->
    <div class="w-1/2 space-y-4">
      <h2 class="text-xl font-bold">옵션 그룹 정보</h2>

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

      <!-- 선택된 옵션 미리보기 -->
      <div>
        <label class="block text-sm font-medium text-gray-700">선택된 옵션들</label>
        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="id in optionGroup.optionIds"
            :key="id"
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
          >
            {{ getOptionNameById(id) }}
          </span>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="pt-4">
        <button @click="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ isEditMode ? '수정' : '추가' }}하기
        </button>
      </div>
    </div>

    <!-- 오른쪽: 옵션 목록 -->
    <div class="w-1/2">
      <h2 class="text-xl font-bold mb-2">옵션 목록</h2>
      <ul class="space-y-2">
        <li
          v-for="opt in allOptions"
          :key="opt.id"
          @click="toggleOption(opt.id)"
          class="p-3 border rounded cursor-pointer hover:bg-gray-50"
          :class="{ 'bg-blue-100 border-blue-400': optionGroup.optionIds.includes(opt.id) }"
        >
          {{ opt.optionName }} ({{ opt.optionItems.length }} 항목)
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { OptionGroup } from '@/shared-types/option/optionGroup';
import type { Option } from '@/shared-types/option/option';

const props = defineProps<{
  optionGroup: OptionGroup;
  allOptions: Option[];
  isEditMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', optionGroup: OptionGroup): void;
}>();

const toggleOption = (optionId: string) => {
  const index = props.optionGroup.optionIds.indexOf(optionId);
  if (index >= 0) {
    props.optionGroup.optionIds.splice(index, 1);
  } else {
    props.optionGroup.optionIds.push(optionId);
  }
};

const getOptionNameById = (id: string) => {
  return props.allOptions.find(o => o.id === id)?.optionName || id;
};

const submit = () => {
  emit('submit', props.optionGroup);
};
</script>
