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

      <span class="text-sm text-gray-600 ml-2">옵션그룹:</span>

      <button
        @click="selectedGroupId = 'ALL'"
        class="px-3 py-1 text-sm font-medium rounded transition"
        :class="{
          'bg-blue-600 text-white': selectedGroupId === 'ALL',
          'bg-gray-100 hover:bg-gray-200': selectedGroupId !== 'ALL',
        }"
      >
        전체
      </button>

      <button
        v-for="group in optionGroupStore.items"
        :key="group.id"
        @click="selectedGroupId = group.id"
        class="px-3 py-1 text-sm font-medium rounded transition"
        :class="{
          'bg-blue-600 text-white': selectedGroupId === group.id,
          'bg-gray-100 hover:bg-gray-200': selectedGroupId !== group.id,
        }"
      >
        {{ group.optionGroupName || '이름 없음' }}
      </button>
    </div>

    <!-- 상태 메시지 -->
    <div class="mb-4 text-sm text-gray-700">
      <span v-if="isServerUpdated">
        ⚠️ 서버에서 내용이 변경되어 저장할 수 없습니다.
      </span>
      <span v-else-if="modifiedItems.length > 0">
        {{ modifiedItems.length }}개의 옵션이 변경되었습니다.
      </span>
      <span v-else>
        변경된 내용이 없습니다.
      </span>
    </div>

    <!-- 옵션 테이블 -->
    <table class="w-full table-fixed border border-gray-200 shadow-sm rounded-lg bg-white">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="p-3">진열순</th>
          <th class="p-3">옵션 이름</th>
          <th class="p-3">수정</th>
        </tr>
      </thead>

      <draggable
        tag="tbody"
        :list="filteredItems"
        item-key="id"
        handle=".drag-handle"
        @end="updateDisplayOrder"
      >
        <template #item="{ element, index }">
          <tr :key="element.id" class="hover:bg-yellow-50 border-t">
            <td class="p-2 text-center drag-handle">
              {{ index + 1 }}
              <span class="ml-1 text-xs text-gray-400">({{ element.displayLevel }})</span>
            </td>

            <td class="p-2" @click="startEditing(index)">
              <input
                v-if="editingIndex === index"
                v-model="element.optionName"
                :id="`input-${index}-optionName`"
                :ref="el => setRef(el as HTMLInputElement, `${index}-optionName`)"
                class="w-full px-2 py-1 border rounded"
                @keydown="e => handleKeydown(e, index, 'optionName')"
                @click.stop
              />
              <span
                v-else
                class="editable-cell block text-sm text-gray-800 min-h-[32px] px-1 py-1"
              >
                {{ element.optionName || '\u00A0' }}
              </span>
            </td>

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

    <!-- 추가 버튼 -->
    <button
      @click="goToCreate"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
    >
      + 옵션 추가
    </button>
  </main>
</template>
<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import isEqual from 'lodash.isequal'

import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import type { Option } from '@/shared-types/option/option'
import { getCompanyId } from '~/utils/getCompanyId'

const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()
const router = useRouter()

const editableItems = ref<Option[]>([])
const originalItems = ref<Option[]>([])
const selectedGroupId = ref<string>('ALL')
const editingIndex = ref<number | null>(null)
const inputRefs = ref<Record<string, HTMLInputElement>>({})
const isServerUpdated = ref(false)
const companyId = getCompanyId();

watch(
  () => optionStore.items.length,
  (len) => {
    if (len > 0 && editableItems.value.length === 0) {
      editableItems.value = optionStore.items.map(o => ({ ...o }))
      originalItems.value = optionStore.items.map(o => ({ ...o }))
    }
  },
  { immediate: true }
)

function startEditing(index: number) {
  editingIndex.value = index
  nextTick(() => {
    const refKey = `${index}-optionName`
    const input = inputRefs.value[refKey]
    if (input) {
      input.focus()
      setTimeout(() => input.select(), 0)
    }
  })
}

function setRef(el: HTMLInputElement | null, key: string) {
  if (el) inputRefs.value[key] = el
}

function handleKeydown(e: KeyboardEvent, rowIndex: number, key: string) {
  const keys = ['optionName']
  const idx = keys.indexOf(key)
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart ?? 0
  const textLength = input.value.length
  const allSelected = input.selectionStart === 0 && input.selectionEnd === textLength
  const allowedKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete', 'Enter']

  if ((e.key === 'ArrowRight' || e.key === 'Tab') && idx < keys.length - 1 && (cursorPos === textLength || allSelected)) {
    e.preventDefault()
    editingIndex.value = rowIndex
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx + 1]}`)
      nextInput?.focus()
      nextInput?.select()
    })
  } else if (e.key === 'ArrowLeft' && idx > 0 && (cursorPos === 0 || allSelected)) {
    e.preventDefault()
    editingIndex.value = rowIndex
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex}-${keys[idx - 1]}`)
      nextInput?.focus()
      nextInput?.select()
    })
  } else if ((e.key === 'ArrowDown' || e.key === 'Enter') && rowIndex < filteredItems.value.length - 1) {
    e.preventDefault()
    editingIndex.value = rowIndex + 1
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex + 1}-${key}`)
      nextInput?.focus()
      nextInput?.select()
    })
  } else if (e.key === 'ArrowUp' && rowIndex > 0) {
    e.preventDefault()
    editingIndex.value = rowIndex - 1
    nextTick(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${rowIndex - 1}-${key}`)
      nextInput?.focus()
      nextInput?.select()
    })
  }
}

function updateDisplayOrder(evt: any) {
  const from = evt.oldIndex
  const to = evt.newIndex
  if (from === undefined || to === undefined) return

  const ordered = [...filteredItems.value]
  const moved = ordered[to]
  const prev = ordered[to - 1]
  const next = ordered[to + 1]

  const step = 100
  const prevLevel = prev?.displayLevel ?? 0
  const nextLevel = next?.displayLevel ?? prevLevel + step * 2

  let newLevel: number

  // 1. 맨 위로 이동
  if (!prev) {
    newLevel = nextLevel - step
    if (newLevel < 1) newLevel = 1
  }
  // 2. 맨 아래로 이동
  else if (!next) {
    newLevel = prevLevel + step
  }
  // 3. 중간에 끼워넣기
  else {
    newLevel = Math.floor((prevLevel + nextLevel) / 2)
  }

  moved.displayLevel = newLevel

  // editableItems에 반영
  const target = editableItems.value.find(o => o.id === moved.id)
  if (target) target.displayLevel = newLevel

  const needsResort =
    editableItems.value.some(o => o.displayLevel < 1) ||
    Math.abs(nextLevel - prevLevel) <= 1 ||
    newLevel === prevLevel ||
    newLevel === nextLevel

  if (needsResort) {
    editableItems.value.sort((a, b) => a.displayLevel - b.displayLevel)
      .forEach((o, i) => (o.displayLevel = (i + 1) * step))
  }
}


function stripMetaFields(obj: any) {
  const { dateCreated, dateModified, ...rest } = obj
  return rest
}

const filteredItems = computed(() => {
  if (selectedGroupId.value === 'ALL') {
    return [...editableItems.value].sort((a, b) => a.displayLevel - b.displayLevel)
  }
  const group = optionGroupStore.items.find(g => g.id === selectedGroupId.value)
  if (!group) return []
  return editableItems.value
    .filter(o => group.optionIds.includes(o.id))
    .sort((a, b) => a.displayLevel - b.displayLevel)
})

const modifiedItems = computed(() => {
  return editableItems.value.filter(edited => {
    const original = originalItems.value.find(o => o.id === edited.id)
    if (!original) return false
    return JSON.stringify(stripMetaFields(edited)) !== JSON.stringify(stripMetaFields(original))
  })
})

const isSaveDisabled = computed(() => isServerUpdated.value || modifiedItems.value.length === 0)

async function saveAll() {
  if (isServerUpdated.value) return
  
  const res = await optionStore.saveItems(companyId!,modifiedItems.value)
  if (res.isSuccess) {
    modifiedItems.value.forEach(modified => {
      const index = optionStore.items.findIndex(o => o.id === modified.id)
      if (index !== -1) optionStore.items[index] = { ...modified }
    })
    originalItems.value = optionStore.items.map(o => ({ ...o }))
    editableItems.value = optionStore.items.map(o => ({ ...o }))
    alert('저장 완료!')
  } else {
    alert('저장 실패: ' + res.message)
  }
}

function goToEdit(id: string) {
  router.push(`/admin/option/edit/${id}`)
}
function goToCreate() {
  router.push(`/admin/option/create`)
}
</script>

<style scoped>
.editable-cell {
  cursor: pointer;
}
</style>
