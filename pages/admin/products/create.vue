<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">상품 추가</h2>
    <ProductForm :product="newProduct" :isEditMode="false" @submit="addProduct" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/product/productStore';
import ProductForm from '@/components/admin/products/ProductForm.vue';
import { createEmptyProduct } from '@/shared-types/product/product'; // 기본 상품 객체

const productStore = useProductStore();

// 새 상품 객체 생성
const newProduct = ref(createEmptyProduct());

// 상품 추가 함수
const addProduct = async (product) => {
  try {
    await productStore.createProduct(product); // 서버에 상품 추가
    newProduct.value = createEmptyProduct(); // 추가 후 초기화
    alert('상품이 추가되었습니다!');
  } catch (error) {
    alert('상품 추가에 실패했습니다.');
  }
};
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>
