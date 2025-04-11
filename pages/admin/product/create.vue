<template>
    <!-- Main Content -->
    <div class="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">상품 추가</h2>
        <ProductForm :product="newProduct" :isEditMode="false" @submit="addProduct" />
      </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SidebarMenu from '@/components/layout/SidebarMenu.vue'; // 메뉴 컴포넌트
import { useProductStore } from '@/stores/product/useProductStore';
import ProductForm from '@/components/admin/product/ProductForm.vue';
import { createEmptyProduct } from '@/shared-types/product/product'; // 기본 상품 객체
import type { Product } from '@/shared-types/product/product'; // Product 타입

const router = useRouter();
const productStore = useProductStore();

// 새 상품 객체 생성
const newProduct = ref<Product>(createEmptyProduct());

// 페이지 이동
function navigateTo(path: string) {
  router.push(path); // 지정된 경로로 이동
}

// 상품 추가 함수
const addProduct = async (product: Product) => {
  alert('상품 추가 요청: ' + JSON.stringify(product)); // 디버깅용
  try {
    await productStore.saveProduct(product); // 서버에 상품 추가
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
