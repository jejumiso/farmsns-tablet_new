<template>
    <!-- Main Content -->
    <div class="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">상품 추가</h2>
        <ProductForm :product="newProduct" :isEditMode="false" :loading="loading" @submit="addProduct" />
      </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product/useProductStore';
import ProductForm from '@/components/admin/product/ProductForm.vue';
import { createEmptyProduct } from '@/shared-types/product/product'; // 기본 상품 객체
import type { Product } from '@/shared-types/product/product'; // Product 타입
import type { ApiResponse } from '~/shared-types/apiResponse';

const router = useRouter();
const productStore = useProductStore();
const loading = ref(false)

// 새 상품 객체 생성
const newProduct = ref<Product>(createEmptyProduct());

// 상품 추가 함수
const addProduct = async (product: Product) => {
  if(loading.value) return
  loading.value = true
 
  try {
    const res = await productStore.saveProduct(product);
    if (res?.isSuccess) {
      // 👉 저장 성공 시, 수동으로 목록에 반영
      console.log('상품 저장 성공:', JSON.stringify(res));
      console.log('상품 저장 성공:', res.data);
      productStore.products.push({ ...product, id: res.data!.id }); // id는 서버 응답에 포함된다고 가정

      // 👉 상품 폼 초기화
      newProduct.value = createEmptyProduct();

      // 👉 목록 페이지로 이동
      router.push('/admin/product');
    } else {
      alert('상품 저장에 실패했습니다: ' + (res?.message || ''));
    }
  } catch (error) {
    alert('상품 추가 중 오류 발생');
    console.error(error);
  } finally {
    loading.value = false
  }
};
</script>


<style scoped>
/* 스타일은 나중에 추가 */
</style>
