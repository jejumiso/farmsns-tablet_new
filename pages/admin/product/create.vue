<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
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
import { useOptionStore } from '@/stores/option/useOptionStore';
import { createEmptyOptionGroup } from '@/shared-types/option/optionGroup';
import OptionGroupForm from '@/components/admin/option-group/OptionGroupForm.vue';
import { createProductService } from '~/services/product/productService';
import { getCompanyId } from '~/utils/getCompanyId';

const router = useRouter();
const optionGroupStore = useOptionGroupStore;
const optionStore = useOptionStore;

const optionGroup = ref(createEmptyOptionGroup());
const allOptions = computed(() => optionStore.items);

const handleSubmit = async (group: any) => {
  const companyId = getCompanyId();
  if (!companyId) return;
  const res = await createProductService().save(companyId,group);
  if (res.isSuccess) {
    alert('상품이 저장되었습니다.');
    router.push('/admin/product');
  } else {
    alert(res.message || '저장에 실패했습니다.');
  }
};
</script>
