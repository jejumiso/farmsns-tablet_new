<template>
  <div class="border p-4 rounded-md bg-white shadow-md">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">옵션 목록</h3>
    <ul class="space-y-2">
      <li
        v-for="opt in filteredOptions"
        :key="opt.id"
        @click="selectOption(opt)"
        class="p-2 border rounded cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-blue-100': selectedOptionId === opt.id }"
      >
        {{ opt.optionName }} ({{ opt.optionItems.length }} 항목)
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import type { Option } from '@/shared-types/option/option';

const props = defineProps<{
  currentOptionId: string;
  otherOptions: Option[];
  selectedOptionId: string;
}>();

const emit = defineEmits<{ (e: 'select', option: Option): void }>();

const filteredOptions = computed(() => {
  return props.otherOptions.filter(opt => opt.id !== props.currentOptionId);
});

function selectOption(option: Option) {
  emit('select', option);
}
</script>

<style scoped>
li.bg-blue-100 {
  font-weight: 600;
  color: #1d4ed8;
}
</style>