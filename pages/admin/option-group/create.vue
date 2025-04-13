<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">옵션 그룹 추가</h2>
    <OptionGroupForm
  :optionGroup="optionGroup"
  :allOptions="allOptions"
  :isEditMode="false"
  @submit="handleSubmit"
/>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore';
import { createEmptyOptionGroup } from '@/shared-types/option/optionGroup';
import OptionGroupForm from '@/components/admin/option-group/OptionGroupForm.vue';
import type { OptionGroup } from '@/shared-types/option/optionGroup';
import type { Option } from '@/shared-types/option/option';
import { useOptionStore } from '@/stores/option/useOptionStore';
import { createOptionGroupService } from '~/services/option-group/optionGroupService'
import { getCompanyId } from '~/utils/getCompanyId';
const router = useRouter();
const optionGroupStore = useOptionGroupStore;
const optionGroup = ref<OptionGroup>(createEmptyOptionGroup());


const optionStore = useOptionStore;
const allOptions = computed(() => optionStore.items); // 스토어에서 옵션 목록 사용

const handleSubmit = async (group: OptionGroup) => {
  const companyId = getCompanyId();
  if (!companyId) return;
  const result = await createOptionGroupService().save(companyId,group);
  if (result.isSuccess) {
    alert('옵션 그룹이 저장되었습니다.');
    router.push('/admin/option-group');
  } else {
    console.error(result.message);
    alert(result.message || '저장에 실패했습니다.');
  }
};
</script>
