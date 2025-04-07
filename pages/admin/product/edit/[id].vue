<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">상품 수정</h2>
    <ProductForm
  v-if="product"
  :product="product"
  :isEditMode="true"
  @submit="updateProduct"
/>
    <div v-else class="text-center text-gray-500">상품을 불러오는 중...</div>
    <div v-if="!product" class="text-center text-red-500">상품을 찾을 수 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product/productStore';
import ProductForm from '@/components/admin/product/ProductForm.vue';
import { useRoute } from 'vue-router';
import type { Product } from '@/shared-types/product/product'; // 경로는 실제 위치에 맞게 조정
const productStore = useProductStore();
const route = useRoute();

// 상품 정보 초기화
//
const product = ref<Product | null>(null);

const fetchProduct = async () => {
  const productId = route.params.id;
  
  const fetchedProduct = productStore.products.find(p => p.id === productId);
  if (fetchedProduct) {
    product.value = { ...fetchedProduct };
  } else {
    alert('상품을 찾을 수 없습니다.');
  }
};

const updateProduct = async (updatedProduct: Product) => {
  try {
    await productStore.saveProduct(updatedProduct); // 상품 수정
    alert('상품이 수정되었습니다!');
  } catch (error) {
    alert('상품 수정에 실패했습니다.');
  }
};

onMounted(() => {
  fetchProduct(); // 페이지 로드 시 상품 데이터 가져오기
});
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>
