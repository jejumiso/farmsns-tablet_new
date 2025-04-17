<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">옵션 그룹 수정</h2>

    <OptionGroupForm
      v-if="optionGroup"
      :optionGroup="optionGroup"
      :allOptions="allOptions"
      :isEditMode="true"
      :loading="loading"
      @submit="handleSubmit"
    />

    <!-- ✅ 삭제 버튼 -->
    <div v-if="optionGroup" class="flex justify-end mt-6">
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import OptionGroupForm from '@/components/admin/option-group/OptionGroupForm.vue'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { showConfirm } from '@/utils/confirmDialog' // confirm 팝업 유틸 (선택사항)
import type { OptionGroup } from '~/shared-types/option/optionGroup'
import { createOptionService } from '~/services/option/optionService'
import { createOptionGroupService } from '~/services/option-group/optionGroupService'

const route = useRoute()
const router = useRouter()
const optionGroupStore = useOptionGroupStore()
const optionStore = useOptionStore()
const authStore = useAuthStore()

const id = route.params.id as string
const optionGroup = ref(optionGroupStore.items.find(g => g.id === id) || null)
const allOptions = ref(optionStore.items)
const loading = ref(false)

onMounted(() => {
  if (!optionGroup.value) {
    optionGroup.value = optionGroupStore.items.find(g => g.id === id) || null
  }
})

const handleSubmit = async (group: OptionGroup) => {
  const companyId = authStore.currentCompany?.id
  if (!companyId || !optionGroup.value) return

  const result = await createOptionGroupService().saveItem(companyId,group);
  if (result.isSuccess) {

        // 👉 수정된 상품을 store에 반영
    const index = optionGroupStore.items.findIndex(p => p.id === group.id);
    if (index !== -1) {
      optionGroupStore.items[index] = { ...group };
    }
    alert('옵션 그룹이 저장되었습니다.');



    router.push('/admin/option-group');
  } else {
    console.error(result.message);
    alert(result.message || '저장에 실패했습니다.');
  }
};

const confirmDelete = async () => {
  const confirmed = await showConfirm('정말 삭제하시겠습니까?')
  if (!confirmed) return

  const companyId = authStore.currentCompany?.id
  if (!companyId || !optionGroup.value) return

  const res = await createOptionGroupService().deleteItem(companyId,optionGroup.value.id)
  if (res.isSuccess) {
    alert('삭제되었습니다.')
    optionGroupStore.items = optionGroupStore.items.filter(p => p.id !== optionGroup.value?.id)

    router.push('/admin/option-group')
  } else {
    alert(res.message || '삭제에 실패했습니다.')
  }
}
</script>
