<!-- pages/admin/option-group/edit/[id].vue 내부 예시 -->
<template>
    <div class="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">옵션 그룹 수정</h2>
  
      <OptionGroupForm
        v-if="optionGroup"
        :optionGroup="optionGroup"
        :allOptions="allOptions"
        :isEditMode="true"
        @submit="handleSubmit"
      />
  
      <!-- ✅ 삭제 버튼 -->
      <div class="flex justify-end mt-6">
        <button
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          @click="confirmDelete"
        >
          삭제하기
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore';
  import { useOptionStore } from '@/stores/option/useOptionStore';
  import { createOptionGroupService } from '@/services/option-group/optionGroupService';
  import OptionGroupForm from '@/components/admin/option-group/OptionGroupForm.vue';
  import { showConfirm } from '@/utils/confirmDialog'; // ✅ confirm 팝업 유틸이 있다면
  import { useAuthStore } from '@/stores/auth/useAuthStore';
  const route = useRoute();
  const router = useRouter();
  const optionGroupStore = useOptionGroupStore();
  const optionStore = useOptionStore();
  
  const id = route.params.id as string;
  const optionGroup = ref(optionGroupStore.optionGroups.find((g) => g.id === id) || null);
  const allOptions = ref(optionStore.options);
  
  onMounted(async () => {
    if (!optionGroup.value) {
      await optionGroupStore.fetchOptionGroupsIfChanged();
      optionGroup.value = optionGroupStore.optionGroups.find((g) => g.id === id) || null;
    }
  });
  
  const handleSubmit = async (submittedGroup: any) => {
    const res = await optionGroupStore.saveOptionGroup(submittedGroup);
    if (res.isSuccess) {
      alert('저장되었습니다.');
      router.push('/admin/option-group');
    }
  };
  
  // ✅ 삭제 처리
  const confirmDelete = async () => {
    const result = await showConfirm('정말 삭제하시겠습니까?');

    if (!result) return;
    

        const authStore = useAuthStore();
        const companyId = authStore.currentCompany?.id;

        if (!companyId) {
        // 예외 처리
        return;
        }
    const res = await createOptionGroupService().delete(companyId, optionGroup.value!.docId, optionGroup.value!.id);
    if (res.isSuccess) {
      alert('삭제되었습니다.');
      await optionGroupStore.fetchOptionGroupsIfChanged();
      router.push('/admin/option-group');
    } else {
      alert('삭제 실패: ' + (res.message || ''));
    }
  };
  </script>
  