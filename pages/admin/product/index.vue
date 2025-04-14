<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, watchEffect ,onBeforeUnmount} from 'vue'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import type { Product } from '@/shared-types/product/product'
import { useRouter } from 'vue-router'
import isEqual from 'lodash.isequal'
import draggable from 'vuedraggable' // Nuxt에서 자동 등록되면 생략 가능
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const selectedCategoryId = ref('ALL')
const editableProducts = ref<Product[]>([])
const originalProducts = ref<Product[]>([])
editableProducts.value = productStore.items.map(p => ({ ...p }))
originalProducts.value = productStore.items.map(p => ({ ...p }))

const isServerUpdated = ref(false)

const router = useRouter()

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  // input, span 둘 다 클릭 허용
  if (!target.closest('input') && !target.closest('.editable-cell')) {
    // 다음 tick에 실행되도록 지연
    setTimeout(() => {
      editingCell.value = null
    }, 0)
  }
}



onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})


function goToEdit(productId: string) {
  router.push(`/admin/product/edit/${productId}`)
}



function stripMetaFields(obj: any) {
  const { dateModified, dateCreated, ...rest } = obj
  return rest
}
// 서버에서 items가 바뀌면 덮어쓰기 방지 및 비활성화 플래그 설정
function updateDisplayOrderMinimal(evt: any) {
  const from = evt.oldIndex
  const to = evt.newIndex
  if (from === undefined || to === undefined) return

  // 현재 화면에 보이는 정렬된 배열
  const ordered = [...filteredProducts.value]
  const moved = ordered[to]

  const prev = ordered[to - 1]
  const next = ordered[to + 1]

  const prevLevel = prev?.displayLevel ?? moved.displayLevel - 100
  const nextLevel = next?.displayLevel ?? moved.displayLevel + 100

  const newLevel = Math.floor((prevLevel + nextLevel) / 2)
  moved.displayLevel = newLevel

  // 실제 editableProducts에 있는 해당 항목 찾아서 displayLevel만 갱신
  const target = editableProducts.value.find(p => p.id === moved.id)
  if (target) {
    target.displayLevel = newLevel
  }

  // 간격 부족 → 전체 재정렬
  if (nextLevel - prevLevel <= 1) {
    editableProducts.value
      .sort((a, b) => a.displayLevel - b.displayLevel)
      .forEach((p, i) => (p.displayLevel = (i + 1) * 100))
  }
}




function updateDisplayOrder() {
  // const ordered = [...filteredProducts.value]
  // ordered.forEach((product, index) => {
  //   product.displayLevel = index + 1
  // })
  // editableProducts.value = ordered.map(p => ({ ...p }))
  filteredProducts.value.forEach((product, index) => {
    product.displayLevel = index + 1
  })
}

watch(
  () => productStore.items.map(stripMetaFields),
  (serverItems) => {
    const localOriginal = originalProducts.value.map(stripMetaFields)
    const localEdited = editableProducts.value.map(stripMetaFields)

    // 1. 서버 데이터와 내가 동기화한 시점의 데이터가 다르면
    const isServerChanged = !isEqual(localOriginal, serverItems)

    // 2. 하지만 내가 수정한 값과 서버 값이 같으면 내가 저장한 걸로 간주
    const isUserJustSaved = isEqual(localEdited, serverItems)

    if (isServerChanged && !isUserJustSaved) {
      isServerUpdated.value = true
    } else {
      isServerUpdated.value = false
      // 동기화된 상태니까 original도 최신으로 업데이트
      originalProducts.value = productStore.items.map(p => ({ ...p }))
      editableProducts.value = productStore.items.map(p => ({ ...p }))
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
  let list = editableProducts.value
  if (selectedCategoryId.value === 'ALL') {
    return [...list].sort((a, b) => a.displayLevel - b.displayLevel)
  }
  if (selectedCategoryId.value === 'UNCATEGORIZED') {
    return list.filter(p => !p.categories || p.categories.length === 0).sort((a, b) => a.displayLevel - b.displayLevel)
  }
  return list.filter(p => p.categories?.includes(selectedCategoryId.value)).sort((a, b) => a.displayLevel - b.displayLevel)
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

  // ✅ 숫자만 입력 가능한 필드에만 제한 적용
  const numberOnlyFields = ['priceOri', 'priceSale']
  if (numberOnlyFields.includes(key)) {
    if (!isNumberKey && !allowedKeys.includes(e.key)) {
      e.preventDefault()
      return
    }
  }

  const keys = ['productName', 'priceOri', 'priceSale']
  const idx = keys.indexOf(key)
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart ?? 0
  const textLength = input.value.length
  const allSelected = input.selectionStart === 0 && input.selectionEnd === textLength

  if (
      (e.key === 'ArrowRight' || e.key === 'Tab') &&
      idx < keys.length - 1 &&
      (cursorPos === textLength || allSelected)
    ) {
      e.preventDefault()
      editingCell.value = { rowIndex, key: keys[idx + 1] }
      nextTick(() => {
        const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx + 1]}`)
        nextInput?.focus()
        nextInput?.select()
      })
    } else if (
      e.key === 'ArrowLeft' &&
      idx > 0 &&
      (cursorPos === 0 || allSelected)
    ) {
      e.preventDefault()
      editingCell.value = { rowIndex, key: keys[idx - 1] }
      nextTick(() => {
        const prevInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx - 1]}`)
        prevInput?.focus()
        prevInput?.select()
      })
    } else if (
      e.key === 'ArrowDown' || e.key === 'Enter'
    ) {
      if (rowIndex < filteredProducts.value.length - 1) {
        e.preventDefault()
        editingCell.value = { rowIndex: rowIndex + 1, key }
        nextTick(() => {
          const downInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex + 1}-${key}`)
          downInput?.focus()
          downInput?.select()
        })
      }
    } else if (e.key === 'ArrowUp') {
      if (rowIndex > 0) {
        e.preventDefault()
        editingCell.value = { rowIndex: rowIndex - 1, key }
        nextTick(() => {
          const upInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex - 1}-${key}`)
          upInput?.focus()
          upInput?.select()
        })
      }
    }
}

async function saveAll() {
  if (isServerUpdated.value) return
  const res = await productStore.saveItems(modifiedProducts.value)
  if (res.isSuccess) {
    // 저장 성공 → 수정된 항목만 productStore.items에 반영
    modifiedProducts.value.forEach(modified => {
    const index = productStore.items.findIndex(p => p.id === modified.id)
    if (index !== -1) {
      productStore.items[index] = { ...modified }
    }
  })
    
    // originalProducts.value = editableProducts.value.map(p => ({ ...p }))
    // editableProducts.value = productStore.items.map(p => ({ ...p }))

    alert('저장 완료!')
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
{{ filteredProducts.length }}개의 상품이 등록되어 있습니다.
    <table class="w-full table-fixed border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 w-12">진열순위</th>
          <th class="p-2 w-32">상품명</th>
          <th class="p-2 w-32">원가</th>
          <th class="p-2 w-32">판매가</th>
          <th class="p-2 w-24">수정</th>
        </tr>
      </thead>
        <draggable
  tag="tbody"
  :list="filteredProducts"
  item-key="id"
  handle=".drag-handle"
  @end="updateDisplayOrderMinimal"

>
  <template #item="{ element, index }">
    <tr :key="element.id" class="hover:bg-yellow-50 border-t border-t">
      <!-- 나머지 td들 그대로 -->
      <td class="p-2 text-center drag-handle">
        {{ index + 1 }}
        <span class="ml-1 text-xs text-gray-400">({{ element.displayLevel }})</span>
      </td>
            <td class="p-2 drag-handle">
            <input
              :id="`input-${index}-productName`"
              v-if="editingCell?.rowIndex === index && editingCell?.key === 'productName'"
              v-model="element.productName"
              :ref="el => setRef(el as HTMLInputElement, `${index}-productName`)"
              @keydown="e => handleKeydown(e, index, 'productName')"
              type="text"
              class="w-full px-1 py-1 border rounded"
            />
            <span
              v-else
              @click="startEditing(index, 'productName')"
              class="editable-cell block cursor-pointer"
            >
              {{ element.productName }}
            </span>
          </td>

          <td class="p-2">
            <input
              :id="`input-${index}-priceOri`"
              v-if="editingCell?.rowIndex === index && editingCell?.key === 'priceOri'"
              :readonly="editingCell?.rowIndex !== index || editingCell?.key !== 'priceOri'"
              v-model.number="element.priceOri"
              :ref="el => setRef(el as HTMLInputElement, `${index}-priceOri`)"
              @keydown="e => handleKeydown(e, index, 'priceOri')"
              type="text"
              class="w-full px-1 py-1 border rounded text-right"
            />
            <span
              v-else
              @click="startEditing(index, 'priceOri')"
              class="editable-cell block cursor-pointer"
            >
              {{ element.priceOri }}
            </span>
          </td>

          <td class="p-2">
            <input
              :id="`input-${index}-priceSale`"
              v-if="editingCell?.rowIndex === index && editingCell?.key === 'priceSale'"
              v-model.number="element.priceSale"
              :ref="el => setRef(el as HTMLInputElement, `${index}-priceSale`)"
              @keydown="e => handleKeydown(e, index, 'priceSale')"
              type="text"
              class="w-full px-1 py-1 border rounded text-right"
            />
            <span
              v-else
              @click="startEditing(index, 'priceSale')"
              class="editable-cell block cursor-pointer"
            >
              {{ element.priceSale }}
            </span>
          </td>
          <!-- 각 row에 버튼 추가 -->
          <td class="p-2 text-center">
            <button
              @click="goToEdit(element.id)"
              class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              수정
            </button>
          </td>
    </tr>
  </template>
</draggable>

        <!-- <tr 
          v-for="(product, rowIndex) in filteredProducts"
          :key="product.id"
          class="hover:bg-yellow-50 border-t border-t"
        >
          <td class="p-2 text-center">{{ rowIndex + 1 }}</td>
          <td class="p-2">
            <input
              :id="`input-${rowIndex}-productName`"
              v-if="editingCell?.rowIndex === rowIndex && editingCell?.key === 'productName'"
              v-model="product.productName"
              :ref="el => setRef(el as HTMLInputElement, `${rowIndex}-productName`)"
              @keydown="e => handleKeydown(e, rowIndex, 'productName')"
              type="text"
              class="w-full px-1 py-1 border rounded"
            />
            <span
              v-else
              @click="startEditing(rowIndex, 'productName')"
              class="editable-cell block cursor-pointer"
            >
              {{ product.productName }}
            </span>
          </td>

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
              class="editable-cell block cursor-pointer"
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
              class="editable-cell block cursor-pointer"
            >
              {{ product.priceSale }}
            </span>
          </td>
          <td class="p-2 text-center">
            <button
              @click="goToEdit(product.id)"
              class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              수정
            </button>
          </td>
        </tr> -->
    </table>
  </main>
  <button
  @click="goToCreate"
  class="fixed bottom-6 right-6 px-3 py-1.5 text-sm bg-blue-600 text-white rounded shadow-md hover:bg-blue-700"
>
  + 상품 등록
</button>

</template>
