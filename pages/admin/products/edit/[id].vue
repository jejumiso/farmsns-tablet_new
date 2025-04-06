<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">상품 등록</h1>
      <ProductForm @submit="handleCreate" />
    </div>
  </template>
  
  <script setup lang="ts">
  import ProductForm from '@/components/admin/products/ProductForm.vue'
  
  function handleCreate(product: any) {
    // 🔸 Firestore 저장 로직 여기에 나중에 추가
    console.log('저장할 상품:', product)
  }
  </script>
  