<template>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">옵션 그룹 추가</h2>
      <OptionGroupForm :optionGroup="optionGroup" :isEditMode="false" @submit="saveOptionGroup" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useOptionGroupStore } from '@/stores/option-group/optionGroupStore';
  import { createEmptyOptionGroup } from '@/shared-types/option/optionGroup';
  import OptionGroupForm from '@/components/admin/option-group/OptionGroupForm.vue';
  
  const optionGroupStore = useOptionGroupStore();
  const optionGroup = ref(createEmptyOptionGroup());
  
  const saveOptionGroup = async (group: typeof optionGroup.value) => {
    await optionGroupStore.saveOptionGroup(group);
  };
  </script>
  