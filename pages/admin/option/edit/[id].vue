<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useOptionStore } from '@/stores/option/optionStore';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import OptionForm from '@/components/admin/option/OptionForm.vue';
import type { Option } from '@/shared-types/option/option';

const route = useRoute();
const router = useRouter();
const optionStore = useOptionStore();

const optionId = route.params.id as string;
const option = ref<Option | null>(null);

const otherOptions = computed(() => {
  return optionStore.options.filter(o => o.id !== optionId);
});

onMounted(async () => {
  await optionStore.fetchOptionsIfChanged();
  option.value = optionStore.options.find(o => o.id === optionId) || null;
});

const handleSubmit = async (submittedOption: Option) => {
  const res = await optionStore.saveOption(submittedOption);
  if (res.isSuccess) {
    alert('옵션이 수정되었습니다.');
    router.push('/admin/option');
  } else {
    alert(res.message + '111' || '옵션 수정에 실패했습니다.');
  }
};
</script>

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
