<template>
  <OptionEditor
    :option="option"
    :isEditMode="isEditMode"
    :loading="loading"
    :otherOptions="otherOptions"
    v-model:activeTab="activeTab"
    v-model:selectedOtherOption="selectedOtherOption"
    @submit="emit('submit', $event)"
    @delete="emit('delete')"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OptionEditor from './OptionEditor.vue'
import type { Option } from '@/shared-types/option/option'

// Props
const props = defineProps<{
  option: Option
  isEditMode: boolean
  loading: boolean
  otherOptions: Option[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'submit', option: Option): void
  (e: 'delete'): void
}>()

// UI 상태
const activeTab = ref('기본 설정')
const selectedOtherOption = ref<Option | null>(null)
</script>
