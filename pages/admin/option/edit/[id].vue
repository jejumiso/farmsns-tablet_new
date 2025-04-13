<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useOptionStore } from '@/stores/option/useOptionStore';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import OptionForm from '@/components/admin/option/OptionForm.vue';
import type { Option } from '@/shared-types/option/option';
import { createOptionService } from '~/services/option/optionService'
import { getCompanyId } from '~/utils/getCompanyId';
const route = useRoute();
const router = useRouter();
const loading = ref(false)
const optionStore = useOptionStore;
const authStore = useAuthStore()
const optionId = route.params.id as string;
const option = ref<Option | null>(null);

const otherOptions = computed(() => {
  return optionStore.items.filter(o => o.id !== optionId);
});

onMounted(async () => {
  option.value = optionStore.items.find(o => o.id === optionId) || null;
});

const handleSubmit = async (submittedOption: Option) => {
  const companyId = authStore.currentCompany?.id
  if (!companyId ) return
  if (loading.value || !option.value) return
  loading.value = true;
  const res = await createOptionService().save(companyId,submittedOption);
  if (res.isSuccess) {
    alert('옵션이 수정되었습니다.');
    router.push('/admin/option');
  } else {
    alert(res.message + '111' || '옵션 수정에 실패했습니다.');
    loading.value = false;
  }
};
const confirmDelete = async () => {
  if (loading.value || !option.value) return
  const companyId = getCompanyId()
  if (!companyId ) return


  const ok = confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
  if (!ok) return

  const res = await createOptionService().deleteItem(companyId,option.value.id) // ✅ 여기 수정

  if (res.isSuccess) {
    alert('삭제되었습니다.')
    router.push('/admin/option')
  } else {
    alert('삭제 실패: ' + (res.message || '알 수 없는 오류입니다.'))
  }
}

</script>

<template>
  <main class="p-6">
    <h1 class="text-2xl font-bold mb-4">옵션 수정</h1>
    <OptionForm
      v-if="option"
      :option="option"
      :isEditMode="true"
      :otherOptions="otherOptions"
      :loading ="loading"
      @submit="handleSubmit"
      @delete="confirmDelete"
    />
    <div v-else class="text-gray-500">옵션을 불러오는 중입니다...</div>
  </main>
</template>
