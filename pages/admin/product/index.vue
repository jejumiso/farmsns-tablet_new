<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, watchEffect } from 'vue'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import type { Product } from '@/shared-types/product/product'
import { useRouter } from 'vue-router'
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const selectedCategoryId = ref('ALL')
const editableProducts = ref<Product[]>([])
const originalProducts = ref<Product[]>([])
const isServerUpdated = ref(false)

const router = useRouter()


function goToEdit(productId: string) {
  router.push(`/admin/product/edit/${productId}`)
}

watchEffect(() => {
  if (originalProducts.value.length === 0 && productStore.items.length > 0) {
    originalProducts.value = productStore.items.map(p => ({ ...p }))
    editableProducts.value = productStore.items.map(p => ({ ...p }))
  }
})

// 서버에서 items가 바뀌면 덮어쓰기 방지 및 비활성화 플래그 설정
watch(
  () => productStore.items,
  (items) => {
    if (originalProducts.value.length === 0) return
    const oldJson = JSON.stringify(originalProducts.value)
    const newJson = JSON.stringify(items)
    if (oldJson !== newJson) {
      isServerUpdated.value = true // ✅ 알림 표시 조건
    }
  },
  { deep: true }
)

const editingCell = ref<{ rowIndex: number; key: string } | null>(null)
const inputRefs = ref<Record<string, HTMLInputElement>>({})

function setRef(el: HTMLInputElement | null, key: string) {
  if (el) inputRefs.value[key] = el
}

const filteredProducts = computed(() => {
  if (selectedCategoryId.value === 'ALL') return editableProducts.value
  if (selectedCategoryId.value === 'UNCATEGORIZED') {
    return editableProducts.value.filter(p => !p.categories || p.categories.length === 0)
  }
  return editableProducts.value.filter(p => p.categories?.includes(selectedCategoryId.value))
})

const modifiedProducts = computed(() => {
  return editableProducts.value.filter(edited => {
    const original = originalProducts.value.find(p => p.id === edited.id)
    return JSON.stringify(edited) !== JSON.stringify(original)
  })
})

const isSaveDisabled = computed(() => isServerUpdated.value || modifiedProducts.value.length === 0)

function startEditing(rowIndex: number, key: string) {
  editingCell.value = { rowIndex, key }
  nextTick(() => {
    const refKey = `${rowIndex}-${key}`
    const input = inputRefs.value[refKey]
    if (input) {
      input.focus()
      setTimeout(() => input.select(), 0)
    }
  })
}

function onlyNumberInput(e: Event) {
  const input = e.target as HTMLInputElement | null
  if (input) {
    input.value = input.value.replace(/[^0-9]/g, '')
  }
}

function handleKeydown(e: KeyboardEvent, rowIndex: number, key: string) {
  const allowedKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete', 'Enter']
  const isNumberKey = /^[0-9]$/.test(e.key)
  if (!isNumberKey && !allowedKeys.includes(e.key)) {
    e.preventDefault()
    return
  }

  const keys = ['priceOri', 'priceSale']
  const idx = keys.indexOf(key)
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart ?? 0
  const textLength = input.value.length
  const allSelected = input.selectionStart === 0 && input.selectionEnd === textLength

  if (e.key === 'ArrowRight' && idx < keys.length - 1 && (cursorPos === textLength || allSelected)) {
    e.preventDefault()
    editingCell.value = { rowIndex, key: keys[idx + 1] }
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx + 1]}`)
      nextInput?.focus()
      nextInput?.select()
    })
  } else if (e.key === 'ArrowLeft' && idx > 0 && (cursorPos === 0 || allSelected)) {
    e.preventDefault()
    editingCell.value = { rowIndex, key: keys[idx - 1] }
    nextTick(() => {
      const prevInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx - 1]}`)
      prevInput?.focus()
      prevInput?.select()
    })
  } else if (e.key === 'ArrowDown' && rowIndex < filteredProducts.value.length - 1) {
    e.preventDefault()
    editingCell.value = { rowIndex: rowIndex + 1, key }
    nextTick(() => {
      const downInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex + 1}-${key}`)
      downInput?.focus()
      downInput?.select()
    })
  } else if (e.key === 'ArrowUp' && rowIndex > 0) {
    e.preventDefault()
    editingCell.value = { rowIndex: rowIndex - 1, key }
    nextTick(() => {
      const upInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex - 1}-${key}`)
      upInput?.focus()
      upInput?.select()
    })
  }
}

async function saveAll() {
  if (isServerUpdated.value) return
  const res = await productStore.saveItems(modifiedProducts.value)
  if (res.isSuccess) {
    alert('저장 완료!')
    originalProducts.value = editableProducts.value.map(p => ({ ...p }))
  } else {
    alert('저장 실패: ' + res.message)
  }
}
function goToCreate() {
  router.push('/admin/product/create')
}
</script>

<template>
  <main class="p-6">
    <div class="mb-2">
      <button
        @click="saveAll"
        :disabled="isSaveDisabled"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        저장
      </button>
      카데고리
      <button
        v-for="cat in ['ALL', 'UNCATEGORIZED', ...categoryStore.items.map(c => c.id)]"
        :key="cat"
        @click="selectedCategoryId = cat"
        class="mr-2 px-3 py-1 rounded"
        :class="{
          'bg-blue-600 text-white': selectedCategoryId === cat,
          'bg-gray-200': selectedCategoryId !== cat
        }"
      >
        {{ cat === 'ALL' ? '전체' : cat === 'UNCATEGORIZED' ? '미등록' : categoryStore.items.find(c => c.id === cat)?.categoryName || cat }}
      </button>
    </div>

    <div class="mb-4 text-sm text-gray-700">
      <span v-if="isServerUpdated">
        ⚠️ 서버에서 내용이 변경되어 저장할 수 없습니다.
      </span>
      <span v-else-if="modifiedProducts.length > 0">
        {{ modifiedProducts.length }}개의 상품이 변경되었습니다.
      </span>
    </div>

    <table class="w-full table-fixed border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 w-12">#</th>
          <th class="p-2 w-32">상품명</th>
          <th class="p-2 w-32">원가</th>
          <th class="p-2 w-32">판매가</th>
          <th class="p-2 w-24">수정</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(product, rowIndex) in filteredProducts"
          :key="product.id"
          class="hover:bg-yellow-50 border-t border-t"
        >
          <td class="p-2 text-center">{{ rowIndex + 1 }}</td>
          <td class="p-2">{{ product.productName }}</td>

          <td class="p-2">
            <input
              :id="`input-${rowIndex}-priceOri`"
              v-if="editingCell?.rowIndex === rowIndex && editingCell?.key === 'priceOri'"
              :readonly="editingCell?.rowIndex !== rowIndex || editingCell?.key !== 'priceOri'"
              v-model.number="product.priceOri"
              :ref="el => setRef(el as HTMLInputElement, `${rowIndex}-priceOri`)"
              @keydown="e => handleKeydown(e, rowIndex, 'priceOri')"
              @input="onlyNumberInput"
              type="text"
              class="w-full px-1 py-1 border rounded text-right"
            />
            <span
              v-else
              @click="startEditing(rowIndex, 'priceOri')"
              class="block cursor-pointer"
            >
              {{ product.priceOri }}
            </span>
          </td>

          <td class="p-2">
            <input
              :id="`input-${rowIndex}-priceSale`"
              v-if="editingCell?.rowIndex === rowIndex && editingCell?.key === 'priceSale'"
              v-model.number="product.priceSale"
              :ref="el => setRef(el as HTMLInputElement, `${rowIndex}-priceSale`)"
              @keydown="e => handleKeydown(e, rowIndex, 'priceSale')"
              @input="onlyNumberInput"
              type="text"
              class="w-full px-1 py-1 border rounded text-right"
            />
            <span
              v-else
              @click="startEditing(rowIndex, 'priceSale')"
              class="block cursor-pointer"
            >
              {{ product.priceSale }}
            </span>
          </td>
          <!-- 각 row에 버튼 추가 -->
          <td class="p-2 text-center">
            <button
              @click="goToEdit(product.id)"
              class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              수정
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
  <button
  @click="goToCreate"
  class="fixed bottom-6 right-6 px-3 py-1.5 text-sm bg-blue-600 text-white rounded shadow-md hover:bg-blue-700"
>
  + 상품 등록
</button>

</template>
