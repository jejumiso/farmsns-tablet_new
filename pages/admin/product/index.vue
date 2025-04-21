<template>
  <main class="p-6">
<!-- 상단 버튼 영역 -->
<div class="flex flex-wrap items-center gap-2 mb-4">
  <button
    @click="saveAll"
    :disabled="isSaveDisabled"
    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
  >
    저장
  </button>

  <span class="text-sm text-gray-600 ml-2">카테고리:</span>

  <button
    v-for="cat in ['ALL', 'UNCATEGORIZED', ...categoryStore.items.map(c => c.id)]"
    :key="cat"
    @click="selectedCategoryId = cat"
    class="px-3 py-1 text-sm font-medium rounded transition"
    :class="{
      'bg-blue-600 text-white': selectedCategoryId === cat,
      'bg-gray-100 hover:bg-gray-200': selectedCategoryId !== cat,
    }"
  >
    {{
      cat === 'ALL' ? '전체' :
      cat === 'UNCATEGORIZED' ? '미등록' :
      categoryStore.items.find(c => c.id === cat)?.categoryName || cat
    }}
  </button>
</div>

    <!-- 상태 메시지 -->
    <div class="mb-4 text-sm text-gray-700">
      <span v-if="isServerUpdated">
        ⚠️ 서버에서 내용이 변경되어 저장할 수 없습니다.
      </span>
      <span v-else-if="modifiedProducts.length > 0">
        {{ modifiedProducts.length }}개의 상품이 변경되었습니다.
      </span>
      <span v-else>
        변경된 내용이 없습니다.
      </span>
    </div>


<!-- 상품 테이블 -->
<table class="w-full  border border-gray-200 shadow-sm rounded-lg  bg-white">
  <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
    <tr>
      <th class="p-3 w-[80px]">진열순</th>
      <th class="p-3 w-[55px]">사진</th>
      <th class="p-3 w-[200px]">상품명</th>
      <th class="p-3 w-[80px]">원가</th>
      <th class="p-3 w-[80px]">판매가</th>
      <th class="p-3 w-[70px]">스탬프</th>
      <th class="p-3 w-[70px]">포인트</th>
      <th class="p-3 w-[160px]">카테고리</th>
      <th class="p-3 w-[160px]">옵션</th>
      <th class="p-3 w-[160px]">옵션그룹</th>
      <th class="p-3 w-[80px]">수정</th>
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
          <tr :key="element.id" class="hover:bg-yellow-50 border-t text-center">
            <!-- 진열 순위 -->
            <td class="p-2 text-center drag-handle">
              {{ index + 1 }}
              <span class="ml-1 text-xs text-gray-400">({{ element.displayLevel }})</span>
              <span class="ml-1 text-xs text-gray-400">({{ element.thumbnailUrl }})</span>
              <span class="ml-1 text-xs text-gray-400">({{ element.galleryImageUrls }})</span>
            </td>
            <td>
  <img
    :src="getImageUrl(element.imageThumbnailFileName)"
    alt="썸네일"
    class="w-12 h-12 object-cover rounded"
  />
</td>

            <!-- 반복 가능한 인풋 필드 렌더링 -->
            <template v-for="key in ['productName', 'priceOriginal', 'priceDiscounted', 'rewardStamp', 'rewardPoint']">
              <td class="p-2"
              @click="startEditing(index, key)">
                <!-- 숫자 필드 -->
    <input
      v-if="editingCell?.rowIndex === index && editingCell?.key === key && isNumericField(key)"
      :id="`input-${index}-${key}`"
      v-model.number="element[key]"
      :ref="el => setRef(el as HTMLInputElement, `${index}-${key}`)"
      @keydown="e => handleKeydown(e, index, key)"
      class="w-full px-1 py-1 border rounded text-right"
      @click.stop
      type="text"
    />

    <!-- 문자열 필드 -->
    <input
      v-else-if="editingCell?.rowIndex === index && editingCell?.key === key"
      :id="`input-${index}-${key}`"
      v-model="element[key]"
      :ref="el => setRef(el as HTMLInputElement, `${index}-${key}`)"
      @keydown="e => handleKeydown(e, index, key)"
      class="w-full px-1 py-1 border rounded"
      @click.stop
      type="text"
    />

    <span
  v-else
  class="editable-cell block text-sm text-gray-800 min-h-[32px] px-1 py-1"
>
  {{ [null, undefined, ''].includes(element[key]) ? ' ' : element[key] }}
</span>
              </td>
            </template>

            <!-- 카테고리 (다중 선택) -->
            <td class="relative">
                <div
                  v-if="editingCell?.rowIndex === index && editingCell?.key === 'categories'"
                  class="absolute z-10 bg-white border rounded shadow p-2 text-sm w-48"
                  @mousedown.stop
                  @click.stop
                  ref="categoryPopup"
                >
                  <label
                    v-for="cat in categoryStore.items"
                    :key="cat.id"
                    class="flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <input type="checkbox" :value="cat.id" v-model="localCategories" />
                    {{ cat.categoryName }}
                  </label>
                </div>
                <span
                  v-else
                  @click="startEditing(index, 'categories')"
                  class="editable-cell block cursor-pointer text-xs"
                >
                  {{ renderCategoryLabel(element.categories) }}
                </span>
              </td>

            <!-- 옵션 (다중 선택) -->
<td class="relative">
  <div
    v-if="editingCell?.rowIndex === index && editingCell?.key === 'optionIds'"
    class="absolute z-10 bg-white border rounded shadow p-2 text-sm w-48"
    @mousedown.stop
    @click.stop
  >
    <label
      v-for="opt in optionStore.items"
      :key="opt.id"
      class="flex items-center gap-1 mb-1"
    >
      <input
        type="checkbox"
        :value="opt.id"
        v-model="element.optionIds"
        :disabled="!!element.optionGroupId"
      />
      {{ opt.optionName }}
    </label>
  </div>

  <span
    v-else
    @click="element.optionGroupId ? null : startEditing(index, 'optionIds')"
    class="editable-cell block cursor-pointer text-xs"
    :class="{ 'text-gray-400': element.optionGroupId }" 
  >
    <span v-if="element.optionGroupId" class="ml-1 text-xs text-gray-400">옵션그룹 적용</span>
    <span v-else>{{ renderOptionLabel(element.optionIds) }}</span>
  </span>
</td>


            <!-- 옵션그룹 (단일 선택) -->
            <td class="relative">
              <div
                v-if="editingCell?.rowIndex === index && editingCell?.key === 'optionGroupId'"
                class="absolute z-10 bg-white border rounded shadow p-2 text-sm w-48"
                @mousedown.stop
                @click.stop
              >
                <label class="flex items-center gap-1 mb-1">
                  <input type="radio" value="" v-model="element.optionGroupId" /> 선택 안함
                </label>
                <label
                  v-for="group in optionGroupStore.items"
                  :key="group.id"
                  class="flex items-center gap-1 mb-1"
                >
                  <input type="radio" :value="group.id" v-model="element.optionGroupId" />
                  {{ group.optionGroupName }}
                </label>
              </div>
              <span
                v-else
                @click="startEditing(index, 'optionGroupId')"
                class="editable-cell block cursor-pointer text-xs"
              >
                {{ renderOptionGroupLabel(element.optionGroupId) }}
              </span>
            </td>

            <!-- 수정 버튼 -->
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
    </table>
  </main>

  <!-- 하단 고정 등록 버튼 -->
  <button
    @click="goToCreate"
    class="fixed bottom-6 right-6 px-3 py-1.5 text-sm bg-blue-600 text-white rounded shadow-md hover:bg-blue-700"
  >
    + 상품 등록
  </button>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import isEqual from 'lodash.isequal'
import draggable from 'vuedraggable'

// 스토어
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'

import type { Product } from '@/shared-types/product/product'
import { getCompanyId } from '~/utils/getCompanyId'
import { STORAGE_BASE_URL } from '~/shared-constants/constants'
const getImageUrl = (fileName: string) => `${STORAGE_BASE_URL}/${fileName}`
// 스토어 인스턴스
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()
const router = useRouter()
const companyId = getCompanyId();
// 상태 정의
const selectedCategoryId = ref('ALL')
const editableProducts = ref<Product[]>([])
const originalProducts = ref<Product[]>([])
const isServerUpdated = ref(false)
const editingCell = ref<{ rowIndex: number; key: string } | null>(null)
const inputRefs = ref<Record<string, HTMLInputElement>>({})

// 초기 데이터 설정
// 새로고침시 캐시에 반영이 즉각 안되기 때문에 0개일때는 캐시에 반영이 된값을 받아들임.
watch(
  () => productStore.items.length,
  (newLen) => {
    if (newLen > 0 && editableProducts.value.length === 0) {
      editableProducts.value = productStore.items.map(p => ({ ...p }))
      originalProducts.value = productStore.items.map(p => ({ ...p }))
    }
  },
  { immediate: true }
)

// 외부 클릭 시 편집 종료

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (
    categoryPopup.value?.contains(target) ||
    target.closest('.editable-cell') ||
    target.closest('input')
  ) {
    return
  }

  if (editingCell.value?.key === 'categories') {
    const index = editingCell.value.rowIndex
    applyCategoryEdit(index)
  }

  editingCell.value = null
}


onMounted(() => window.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('mousedown', handleClickOutside))

// displayLevel minimal 변경 로직 (카테고리 전체일 때만 허용)
function updateDisplayOrderMinimal(evt: any) {
  if (selectedCategoryId.value !== 'ALL') {
    alert('카테고리가 "전체"일 때만 정렬이 가능합니다.')
    return
  }

  const from = evt.oldIndex
  const to = evt.newIndex
  if (from === undefined || to === undefined) return

  const ordered = [...filteredProducts.value]
  const moved = ordered[to]
  const prev = ordered[to - 1]
  const next = ordered[to + 1]

  const step = 100
  const prevLevel = prev?.displayLevel ?? 0
  const nextLevel = next?.displayLevel ?? prevLevel + step * 2

  let newLevel: number

  // 1. 맨 위로 올릴 때
  if (!prev) {
    newLevel = nextLevel - step
    if (newLevel < 1) newLevel = 1
  }
  // 2. 맨 아래로 내릴 때
  else if (!next) {
    newLevel = prevLevel + step
  }
  // 3. 중간에 끼워 넣을 때
  else {
    newLevel = Math.floor((prevLevel + nextLevel) / 2)
  }

  moved.displayLevel = newLevel

  // editableProducts에 반영
  const target = editableProducts.value.find(p => p.id === moved.id)
  if (target) target.displayLevel = newLevel

  const needsResort =
    editableProducts.value.some(p => p.displayLevel < 1) ||
    Math.abs(nextLevel - prevLevel) <= 1 ||
    newLevel === prevLevel ||
    newLevel === nextLevel

  if (needsResort) {
    editableProducts.value.sort((a, b) => a.displayLevel - b.displayLevel)
      .forEach((p, i) => (p.displayLevel = (i + 1) * step))
  }
}



// watch로 서버 변경 감지 및 동기화
function stripMetaFields(obj: any) {
  const { dateModified, dateCreated, ...rest } = obj
  return rest
}

watch(
  () => productStore.items.map(stripMetaFields),
  (serverItems) => {
    const localOriginal = originalProducts.value.map(stripMetaFields)
    const localEdited = editableProducts.value.map(stripMetaFields)

    const isServerChanged = !isEqual(localOriginal, serverItems)
    const isUserJustSaved = isEqual(localEdited, serverItems)

    if (isServerChanged && !isUserJustSaved) {
      isServerUpdated.value = true
    } else {
      isServerUpdated.value = false
      originalProducts.value = productStore.items.map(p => ({ ...p }))
      editableProducts.value = productStore.items.map(p => ({ ...p }))
    }
  },
  { deep: true }
)

// 필터링된 목록 (카테고리별)
const filteredProducts = computed(() => {
  const list = editableProducts.value
  if (selectedCategoryId.value === 'ALL') return [...list].sort((a, b) => a.displayLevel - b.displayLevel)
  if (selectedCategoryId.value === 'UNCATEGORIZED') return list.filter(p => !p.categories?.length).sort((a, b) => a.displayLevel - b.displayLevel)
  return list.filter(p => p.categories?.includes(selectedCategoryId.value)).sort((a, b) => a.displayLevel - b.displayLevel)
})
const numericKeys = ['priceOriginal', 'priceDiscounted', 'rewardStamp', 'rewardPoint'] as const
type NumericKey = typeof numericKeys[number]
// 수정된 항목 감지
const modifiedProducts = computed(() => {
  return editableProducts.value.filter(edited => {
    const original = originalProducts.value.find(p => p.id === edited.id)
    if (!original) return false



    // 👇 여기에 수정값 보정 로직 추가
    numericKeys.forEach(key => {
      const value = edited[key as keyof Product]
      if (typeof value !== 'number' || isNaN(value)) {
        edited[key as NumericKey] = 0
      }
    })

    return JSON.stringify(edited) !== JSON.stringify(original)
  })
})



const isSaveDisabled = computed(() => isServerUpdated.value || modifiedProducts.value.length === 0)



const categoryPopup = ref<HTMLElement | null>(null)
const localCategories = ref<string[]>([])

function startEditing(index: number, key: string) {
  editingCell.value = { rowIndex: index, key }

  if (key === 'categories') {
    localCategories.value = [...filteredProducts.value[index].categories ?? []]
  }

  nextTick(() => {
    const refKey = `${index}-${key}`
    const input = inputRefs.value[refKey]
    if (input) {
      input.focus()
      setTimeout(() => input.select(), 0)
    }
  })
}

function applyCategoryEdit(index: number) {
  const product = filteredProducts.value[index]
  const target = editableProducts.value.find(p => p.id === product.id)
  if (target) {
    target.categories = [...localCategories.value]
  }
  editingCell.value = null
}


function setRef(el: HTMLInputElement | null, key: string) {
  if (el) inputRefs.value[key] = el
}

// // 입력 시 숫자만 허용
// function onlyNumberInput(e: Event, key: string) {
//   const input = e.target as HTMLInputElement
//   if (!input) return

//   if (['priceOri', 'priceSale', 'rewardStamp', 'rewardPoint'].includes(key)) {
//     input.value = input.value.replace(/[^\d]/g, '')
//     input.dispatchEvent(new Event('input')) // v-model 강제 반영
//   }
// }


function isNumericField(key: string): boolean {
  return numericKeys.includes(key as typeof numericKeys[number])
}

// 방향키 입력 처리
function handleKeydown(e: KeyboardEvent, rowIndex: number, key: string) {
  const keys = ['productName', 'priceOriginal', 'priceDiscounted', 'rewardStamp', 'rewardPoint']
  const idx = keys.indexOf(key)
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart ?? 0
  const textLength = input.value.length
  const allSelected = input.selectionStart === 0 && input.selectionEnd === textLength
  const allowedKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete', 'Enter']
  const isNumberKey = /^[0-9]$/.test(e.key)

  if (numericKeys.includes(key as typeof numericKeys[number])) {
    if (!isNumberKey && !allowedKeys.includes(e.key)) {
      e.preventDefault()
      return
    }
  }

  if ((e.key === 'ArrowRight' || e.key === 'Tab') && idx < keys.length - 1 && (cursorPos === textLength || allSelected)) {
    e.preventDefault()
    editingCell.value = { rowIndex, key: keys[idx + 1] }
    nextTick(() =>{
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx + 1]}`)
      nextInput?.focus() 
      nextInput?.select() 
  })
  } else if (e.key === 'ArrowLeft' && idx > 0 && (cursorPos === 0 || allSelected)) {
    e.preventDefault()
    editingCell.value = { rowIndex, key: keys[idx - 1] }
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx - 1]}`)
      nextInput?.focus() 
      nextInput?.select() 
  })
  } else if ((e.key === 'ArrowDown' || e.key === 'Enter') && rowIndex < filteredProducts.value.length - 1) {
    e.preventDefault()
    editingCell.value = { rowIndex: rowIndex + 1, key }
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex + 1}-${key}`)
      nextInput?.focus() 
      nextInput?.select() 
  })
  } else if (e.key === 'ArrowUp' && rowIndex > 0) {
    e.preventDefault()
    editingCell.value = { rowIndex: rowIndex - 1, key }
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex - 1}-${key}`)
      nextInput?.focus() 
      nextInput?.select() 
  })
  }
}

// 저장 처리
// 저장 처리
async function saveAll() {
  if (isServerUpdated.value) return

  // 👇 저장 전에 유효하지 않은 ID 제거
  const validCategoryIds = new Set(categoryStore.items.map(c => c.id))
  const validOptionIds = new Set(optionStore.items.map(o => o.id))
  const validOptionGroupIds = new Set(optionGroupStore.items.map(g => g.id))

  modifiedProducts.value.forEach(p => {
    p.categories = (p.categories || []).filter(id => validCategoryIds.has(id))
    p.optionIds = (p.optionIds || []).filter(id => validOptionIds.has(id))
    if (p.optionGroupId && !validOptionGroupIds.has(p.optionGroupId)) {
      p.optionGroupId = ''
    }
  })

  const res = await productStore.saveItems(companyId!,modifiedProducts.value)
  if (res.isSuccess) {
    modifiedProducts.value.forEach(modified => {
      const index = productStore.items.findIndex(p => p.id === modified.id)
      if (index !== -1) productStore.items[index] = { ...modified }
    })
    alert('저장 완료!')
  } else {
    alert('저장 실패: ' + res.message)
  }
}


// 페이지 이동
function goToEdit(productId: string) {
  router.push(`/admin/product/edit/${productId}`)
}
function goToCreate() {
  router.push('/admin/product/create')
}

// 렌더링 텍스트 함수들
function renderCategoryLabel(ids: string[]) {
  const validIds = ids.filter(id => categoryStore.items.some(c => c.id === id))
  if (validIds.length === 0) return '없음'

  const first = categoryStore.items.find(c => c.id === validIds[0])?.categoryName
  return validIds.length === 1
    ? first!
    : `${first!} 외 ${validIds.length - 1}개`
}

function renderOptionLabel(ids: string[]) {
  const validIds = ids.filter(id => optionStore.items.some(o => o.id === id))
  if (validIds.length === 0) return '없음'

  const first = optionStore.items.find(o => o.id === validIds[0])?.optionName
  return validIds.length === 1
    ? first!
    : `${first!} 외 ${validIds.length - 1}개`
}

function renderOptionGroupLabel(id: string) {
  if (!id) return '선택 안함'
  const group = optionGroupStore.items.find(g => g.id === id)
  return group ? group.optionGroupName : '없음'
}
</script>
