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

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const id = route.params.id as string;

const category = ref<Category | null>(null);

onMounted(async () => {
  category.value = categoryStore.categories.find(c => c.id === id) || null;
});

const handleSubmit = async (submitted: Category) => {
  const res = await categoryStore.saveCategory(submitted);
  if (res.isSuccess) {
    alert('수정되었습니다.');
    router.push('/admin/category');
  } else {
    alert(res.message || '수정 실패');
  }
};

const handleDelete = async () => {
  if (!category.value) return;
  const ok = await showConfirm('정말 삭제하시겠습니까?');
  if (!ok) return;
  const res = await categoryStore.deleteCategory(category.value.id);
  if (res.isSuccess) {
    alert('삭제되었습니다.');
    router.push('/admin/category');
  } else {
    alert(res.message || '삭제 실패');
  }
};
</script>