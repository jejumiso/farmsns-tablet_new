<template>
  <form @submit.prevent="submitForm">
    <!-- 상품명 -->
    <div>
      <label for="productName" class="block text-sm font-medium text-gray-700">상품명</label>
      <input v-model="product.productName" type="text" id="productName" class="w-full mt-2 p-2 border rounded" required />
    </div>

    <!-- 가격 -->
    <div>
      <label for="priceOri" class="block text-sm font-medium text-gray-700">정상 가격</label>
      <input v-model="product.priceOri" type="number" id="priceOri" class="w-full mt-2 p-2 border rounded" required />
    </div>

    <!-- 상품 설명 -->
    <div>
      <label for="explanation" class="block text-sm font-medium text-gray-700">상품 설명</label>
      <textarea v-model="product.explanation" id="explanation" rows="4" class="w-full mt-2 p-2 border rounded" required></textarea>
    </div>

    <!-- 이미지 URL -->
    <div>
      <label for="imgUrl" class="block text-sm font-medium text-gray-700">상품 이미지 URL</label>
      <input v-model="product.imgUrl" type="text" id="imgUrl" class="w-full mt-2 p-2 border rounded" required />
    </div>

    <!-- 카테고리 -->
    <div>
      <label for="categories" class="block text-sm font-medium text-gray-700">카테고리</label>
      <input v-model="product.categories" type="text" id="categories" class="w-full mt-2 p-2 border rounded" placeholder="카테고리 입력" required />
    </div>

    <!-- 추가/수정 버튼 -->
    <div class="flex justify-end">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
        {{ isEditMode ? '수정' : '추가' }}하기
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { type Product } from '@/shared-types/product/product';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['submit']);

// 상품 폼 제출 처리
const submitForm = () => {
  emit('submit', props.product);
};
</script>

<style scoped>
/* 스타일을 필요에 맞게 조정 */
</style>
