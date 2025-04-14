<script setup lang="ts">
import { useOptionStore } from '@/stores/option/useOptionStore'

const optionStore = useOptionStore()
</script>

<template>
  <main class="flex-1 bg-gray-100 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">상품 목록</h1>

    <div v-if="optionStore.loading" class="text-center text-gray-500">상품을 불러오는 중...</div>
    <div v-if="optionStore.error" class="text-center text-red-500">{{ optionStore.error }}</div>

    <div v-if="optionStore.items.length > 0">
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="px-4 py-2">번호</th>
            <th class="px-4 py-2">id</th>
            <th class="px-4 py-2">이미지</th>
            <th class="px-4 py-2">상품명</th>
            <th class="px-4 py-2">수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in optionStore.items" :key="product.id" class="border-t">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ product.id }}</td>
            <td class="px-4 py-2">
              <!-- 이미지가 있을 경우에만 출력 -->
              <!-- <img :src="product.imageThumbnailUrl" alt="상품 이미지" class="h-12 w-12 object-cover rounded" /> -->
            </td>
            <td class="px-4 py-2">{{ product.optionName }}</td>
            <td class="px-4 py-2">
              <router-link :to="`/admin/option/edit/${product.id}`" class="text-blue-600 hover:underline">수정</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!optionStore.loading" class="text-center text-gray-500 mt-4">옵션이 없습니다.</div>

    <div class="mt-6 text-center">
      <router-link to="/admin/option/create" class="text-blue-600 hover:underline">옵션 추가하기</router-link>
    </div>
  </main>
</template>
