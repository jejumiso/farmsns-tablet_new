<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SidebarMenu @navigate="navigateTo" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">상품 목록</h1>

      <p class="mb-4">여기는 상품 목록을 보여주는 페이지입니다. 아래는 상품 목록입니다:</p>
      
      <!-- 상품 목록 (저장소에서 가져온 데이터) -->
      <div v-if="loading" class="text-center text-gray-500">상품을 불러오는 중...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>

      <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white p-4 rounded-lg shadow-md">
          <img :src="product.imageUrl" alt="상품 이미지" class="w-full h-48 object-cover mb-4 rounded-lg" />
          <h2 class="text-lg font-semibold text-gray-800">{{ product.name }}</h2>
          <p class="text-gray-600">{{ product.description }}</p>
          <p class="mt-2 text-gray-900 font-bold">{{ product.price | currency }}</p>
        </div>
      </div>
      <div v-if="products.length === 0" class="text-center text-gray-500">상품이 없습니다.</div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import { useProductStore } from '@/stores/product/productStore'; // Pinia store

const router = useRouter();
const productStore = useProductStore(); // Pinia store에서 상품 목록 가져오기

// 상태 변수
const products = ref([]);
const loading = ref(false);
const error = ref(null);

// 페이지 이동
function navigateTo(path) {
  router.push(path); // 지정된 경로로 이동
}

// 상품 목록 불러오기
async function loadProducts() {
  loading.value = true;
  error.value = null;
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
