<!-- pages/admin/option/create.vue -->
<template>
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">옵션 추가</h1>
      <OptionForm
        :option="option"
        :isEditMode="false"
        :otherOptions="[]"   
        :loading="loading"
        @submit="handleSubmit"
      />
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useOptionStore } from '@/stores/option/useOptionStore';
  import { createEmptyOption, type Option } from '@/shared-types/option/option';
  import OptionForm from '@/components/admin/option/OptionForm.vue';
  import { useRouter } from 'vue-router';
import { createOptionService } from '~/services/option/optionService';
import { getCompanyId } from '~/utils/getCompanyId';
  const loading = ref(false)
  const optionStore = useOptionStore();
  const option = ref(createEmptyOption());
  const router = useRouter();
  const handleSubmit = async (submittedOption: Option) => {
    const companyId = getCompanyId();
    if (!companyId) return;
    const res = await createOptionService().saveItem(companyId,submittedOption);

    if (res.isSuccess) {
      optionStore.items.push({ ...submittedOption, id: res.data.id }) // 스토어 반영
      alert('옵션이 성공적으로 저장되었습니다.');
      router.push('/admin/option');
    } else {
      alert('에러 : '+res.message || '옵션 저장에 실패했습니다.');
    }
  };
  </script>