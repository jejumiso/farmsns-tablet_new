<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">옵션 그룹 추가</h2>
    <OptionGroupForm
  :optionGroup="optionGroup"
  :allOptions="allOptions"
  :isEditMode="false"
  :loading="loading"
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
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { getCompanyId } from '~/utils/getCompanyId';
const router = useRouter();
const optionGroupStore = useOptionGroupStore();
const authStore = useAuthStore();
const optionGroup = ref<OptionGroup>(createEmptyOptionGroup());


const optionStore = useOptionStore();
const allOptions = computed(() => optionStore.items); // 스토어에서 옵션 목록 사용
const loading = ref(false)

const handleSubmit = async (group: OptionGroup) => {
  if (loading.value) return;
  loading.value = true;

  try {
    const companyId = authStore.currentCompany?.id!;
    const res = await createOptionGroupService().saveItem(companyId, group);

    if (res?.isSuccess && res.data?.id) {
      optionGroupStore.items.push({ ...group, id: res.data.id }); // 스토어 반영
      router.push('/admin/option-group');
    } else {
      alert('옵션 그룹 등록 실패: ' + (res?.message || ''));
    }
  } catch (error) {
    console.error('옵션 그룹 등록 오류:', error);
    alert('옵션 그룹 등록 중 오류 발생');
  } finally {
    loading.value = false;
  }
};

</script>
