<!-- pages/admin/option/create.vue -->
<template>
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">옵션 추가</h1>
      <OptionForm
  :option="option"
  :isEditMode="false"
  :otherOptions="[]"   
  @submit="handleSubmit"
/>
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useOptionStore } from '@/stores/option/optionStore';
  import { createEmptyOption } from '@/shared-types/option/option';
  import OptionForm from '@/components/admin/option/OptionForm.vue';
  
  const optionStore = useOptionStore();
  const option = ref(createEmptyOption());
  
  const handleSubmit = async (submittedOption: any) => {
    await optionStore.saveOption(submittedOption);
  };
  </script>