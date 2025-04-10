<template>
    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">상품 목록</h1>

      <div v-if="loading" class="text-center text-gray-500">상품을 불러오는 중...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>

      <div v-if="products.length > 0">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-left">
            <tr>
              <th class="px-4 py-2">번호</th>
              <th class="px-4 py-2">이미지</th>
              <th class="px-4 py-2">상품명</th>
              <th class="px-4 py-2">수정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id" class="border-t">
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2">
                <!-- <img :src="product.imgUrls" alt="상품 이미지" class="h-12 w-12 object-cover rounded" /> -->
              </td>
              <td class="px-4 py-2">{{ product.productName }}</td>
              <td class="px-4 py-2">
                <router-link :to="`/admin/product/edit/${product.id}`" class="text-blue-600 hover:underline">수정</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="products.length === 0" class="text-center text-gray-500 mt-4">상품이 없습니다.</div>

      <!-- 상품 추가 링크 -->
      <div class="mt-6 text-center">
        <router-link to="/admin/product/create" class="text-blue-600 hover:underline">상품 추가하기</router-link>
      </div>
    </main>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import { useProductStore } from '@/stores/product/productStore'; // Pinia store
import type { Product } from '@/shared-types/product/product'; // 경로는 실제 위치에 맞게 조정

const router = useRouter();
const productStore = useProductStore(); // Pinia store에서 상품 목록 가져오기

// 상태 변수

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref('');

// 페이지 이동
function navigateTo(path: string) {
  router.push(path); // 지정된 경로로 이동
}

// 상품 목록 불러오기
async function loadProducts() {
  loading.value = true;
  error.value = '';
  try {
    await productStore.fetchProductsIfChanged(); // 저장소에서 상품 목록 갱신
    products.value = productStore.products; // 저장소에서 상품 목록 가져오기
  } catch (err) {
    error.value = '상품 목록을 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProducts(); // 컴포넌트 마운트 시 상품 목록 불러오기
});
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>
