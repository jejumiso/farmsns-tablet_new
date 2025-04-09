<template>
  <OptionEditor
    :option="option"
    :isEditMode="isEditMode"
    :otherOptions="otherOptions"
    v-model:activeTab="activeTab"
    v-model:selectedOtherOption="selectedOtherOption"
    @submit="submitForm"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OptionEditor from './OptionEditor.vue';
import type { Option } from '@/shared-types/option/option';

const props = defineProps<{
  option: Option;
  isEditMode: boolean;
  otherOptions: Option[];
  onSubmit?: (option: Option) => void;
}>();

const emit = defineEmits<{
  (e: 'submit', option: Option): void;
}>();

const activeTab = ref('기본 설정');
const selectedOtherOption = ref<Option | null>(null);

const submitForm = (option: Option) => {
  emit('submit', option);
};
</script>