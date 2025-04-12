<template>
  <div class="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">상품 수정</h2>
    <ProductForm
  v-if="product"
  :product="product"
  :isEditMode="true"
  :loading="loading"
  @submit="updateProduct"
  @delete="confirmDelete"
/>
    <div v-else class="text-center text-gray-500">상품을 불러오는 중...</div>
    <div v-if="!product" class="text-center text-red-500">상품을 찾을 수 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product/useProductStore';
import ProductForm from '@/components/admin/product/ProductForm.vue';
import { useRoute } from 'vue-router';
import type { Product } from '@/shared-types/product/product'; // 경로는 실제 위치에 맞게 조정
const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false)
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
  if(loading.value) return
  loading.value = true
  
  try {
    const res = await productStore.saveProduct(updatedProduct);

    if (res?.isSuccess) {
      // 👉 수정된 상품을 store에 반영
      const index = productStore.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        productStore.products[index] = { ...updatedProduct };
      }

      // alert('상품이 수정되었습니다!');
      router.push('/admin/product'); // ✅ 수정 후 목록 페이지로 이동
    } else {
      alert('상품 수정에 실패했습니다: ' + (res?.message || ''));
    }
  } catch (error) {
    alert('상품 수정 중 오류 발생');
    console.error(error);
  }
  finally {
    loading.value = false
  }
};
const confirmDelete = async () => {
  if(loading.value) return
  loading.value = true
  const ok = confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
  if (!ok || !product.value) {
    loading.value = false
    return
  }

  const res = await productStore.deleteProduct(product.value.id)

  if (res.isSuccess) {
    // 스토어에서 삭제된 상태는 이미 반영됨
    // alert('상품이 삭제되었습니다.')
    router.push('/admin/product') // 목록으로 이동
  } else {
    alert('삭제 실패: ' + (res.message || '알 수 없는 오류입니다.'))
  }

    loading.value = false
}


onMounted(() => {
  fetchProduct(); // 페이지 로드 시 상품 데이터 가져오기
});
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>
