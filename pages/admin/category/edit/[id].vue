<template>
  <main class="p-6">
    <h1 class="text-2xl font-bold mb-4">카테고리 수정</h1>
    <CategoryForm
      v-if="category"
      :category="category"
      :isEditMode="true"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
    <div v-else>카테고리를 불러오는 중입니다...</div>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category/useCategoryStore';
import CategoryForm from '@/components/admin/category/CategoryForm.vue';
import { showConfirm } from '@/utils/confirmDialog';
import type { Category } from '@/shared-types/category/category';
import { createCategoryService } from '~/services/category/categoryService';
import { useAuthStore } from '@/stores/auth/useAuthStore';
const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const authStore = useAuthStore()
const id = route.params.id as string;

const category = ref<Category | null>(null);

onMounted(async () => {
  category.value = categoryStore.items.find(c => c.id === id) || null;
});

const handleSubmit = async (submitted: Category) => {
  const companyId = authStore.currentCompany?.id
  if (!companyId ) return
  const res = await createCategoryService().saveItem(companyId, submitted);
  if (res.isSuccess) {
      // 👉 수정된 상품을 store에 반영
    const index = categoryStore.items.findIndex(p => p.id === submitted.id);
    if (index !== -1) {
      categoryStore.items[index] = { ...submitted };
    }


    alert('수정되었습니다.');
    router.push('/admin/category');
  } else {
    alert(res.message || '수정 실패');
  }
};

const handleDelete = async () => {
  const companyId = authStore.currentCompany?.id
  if (!companyId ) return
  if (!category.value) return;
  const ok = await showConfirm('정말 삭제하시겠습니까?');
  if (!ok) return;
alert(companyId)
  const res = await createCategoryService().deleteItem(companyId,category.value.id);
  if (res.isSuccess) {
    alert('삭제되었습니다.');
    categoryStore.items = categoryStore.items.filter(p => p.id !== category.value?.id)
    router.push('/admin/category');
  } else {
    alert(res.message || '삭제 실패');
  }
};
</script>