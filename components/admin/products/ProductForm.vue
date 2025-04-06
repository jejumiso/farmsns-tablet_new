<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">상품명</label>
        <input v-model="form.name" type="text" class="input" required />
      </div>
  
      <div>
        <label class="block font-medium mb-1">가격</label>
        <input v-model.number="form.price" type="number" class="input" required />
      </div>
  
      <div>
        <label class="block font-medium mb-1">설명</label>
        <textarea v-model="form.description" class="input" />
      </div>
  
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        저장
      </button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const emit = defineEmits<{
    (e: 'submit', payload: any): void
  }>()
  
  const form = ref({
    name: '',
    price: 0,
    description: '',
  })
  
  function onSubmit() {
    emit('submit', form.value)
  }
  </script>
  
  <style scoped>
  .input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  