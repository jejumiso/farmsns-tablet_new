<template>
  <div class="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">상품 등록</h2>
    <ProductForm
      :product="product"
      :isEditMode="false"
      :loading="loading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductForm from '@/components/admin/product/ProductForm.vue'
import { createEmptyProduct, type Product } from '@/shared-types/product/product'
import { createProductService } from '@/services/product/productService'
import { useProductStore } from '@/stores/product/useProductStore'
import { useAuthStore } from '@/stores/auth/useAuthStore'

const router = useRouter()
const productStore = useProductStore()
const authStore = useAuthStore()

const loading = ref(false)

// ✅ 빈 상품 기본값
const product = ref<Product>(createEmptyProduct())
  product.value.companyId = authStore.currentCompany?.id || ''

  

const handleSubmit = async (newProduct: Product) => {
  if (loading.value) return
  loading.value = true

  try {
    const companyId = authStore.currentCompany?.id!
    const res = await createProductService().saveItem(companyId, newProduct)

    if (res?.isSuccess && res.data?.id) {
      productStore.items.push({ ...newProduct, id: res.data.id }) // 스토어 반영
      router.push('/admin/product')
    } else {
      alert('상품 등록 실패: ' + (res?.message || ''))
    }
  } catch (error) {
    console.error('상품 등록 오류:', error)
    alert('상품 등록 중 오류 발생')
  } finally {
    loading.value = false
  }
}
</script>
