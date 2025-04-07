<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">상품 수정</h2>
    <ProductForm :product="product" :isEditMode="true" @submit="updateProduct" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product/productStore';
import ProductForm from '@/components/admin/products/ProductForm.vue';
import { useRoute } from 'vue-router';

const productStore = useProductStore();
const route = useRoute();

// 상품 정보 초기화
const product = ref(null);

const fetchProduct = async () => {
  const productId = route.params.id;
  const fetchedProduct = productStore.products.find(p => p.id === productId);
  if (fetchedProduct) {
    product.value = { ...fetchedProduct };
  } else {
    alert('상품을 찾을 수 없습니다.');
  }
};

const updateProduct = async (updatedProduct) => {
  try {
    await productStore.updateProduct(updatedProduct); // 상품 수정
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
