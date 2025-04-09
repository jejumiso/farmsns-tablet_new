<!-- pages/admin/option/edit/[id].vue -->
<template>
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">옵션 수정</h1>
      <OptionForm
  v-if="option"
  :option="option"
  :isEditMode="true"
  :otherOptions="otherOptions"
  @submit="handleSubmit"
/>
      <div v-else class="text-gray-500">옵션을 불러오는 중입니다...</div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useOptionStore } from '@/stores/option/optionStore';
  import type { Option } from '@/shared-types/option/option';
  import OptionForm from '@/components/admin/option/OptionForm.vue';
  
  const route = useRoute();
  const optionStore = useOptionStore();
  const option = ref<Option | null>(null);
  const optionId = route.params.id;

  const otherOptions = computed(() => optionStore.options.filter(o => o.id !== optionId));

  
  const loadOption = async () => {
    const id = route.params.id;
    option.value = optionStore.options.find(o => o.id === id) || null;
  };
  
  const handleSubmit = async (submittedOption: Option) => {
    await optionStore.saveOption(submittedOption);
  };
  
  onMounted(() => {
    loadOption();
  });
  </script>
  