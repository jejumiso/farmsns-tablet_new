// pages/admin/category/create.vue
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">카테고리 추가</h1>
    <CategoryForm :category="category" :isEditMode="false" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createEmptyCategory } from '@/shared-types/category/category';
import CategoryForm from '@/components/admin/category/CategoryForm.vue';
import { createCategoryService } from '~/services/category/categoryService';
import { getCompanyId } from '~/utils/getCompanyId';
const category = ref(createEmptyCategory());

const handleSubmit = async (submittedCategory: typeof category.value) => {
  const companyId = getCompanyId();
  if (!companyId) return;

console.log('📡 LOGGER - 제출된 카테고리:', submittedCategory);
  const res = await createCategoryService().save(companyId,submittedCategory);
  if (res.isSuccess) {
    alert('카테고리가 추가되었습니다.');
    navigateTo('/admin/category');
  } else {
    console.log('📡 LOGGER - 제출된 카테고리:', res.message);
    alert(res.message || '추가 실패');
  }
};
</script>
