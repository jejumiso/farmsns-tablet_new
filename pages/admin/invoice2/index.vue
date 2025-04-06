<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SidebarMenu @navigate="navigateTo" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6 flex">
      <!-- 왼쪽: 데이터 입력 -->
      <div class="w-2/3 pr-4">
        <!-- 택배 회사 선택 -->
        <div class="mb-4 flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <button
              @click="toggleMode"
              class="px-4 py-2 rounded border font-bold text-sm"
              :class="isGlobalMode
                ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                : 'bg-red-500 text-white border-red-500 hover:bg-red-600'"
            >
              {{ isGlobalMode ? '전체' : '개별' }}
            </button>
            <div class="flex space-x-2">
              <button
                v-for="courier in couriers"
                :key="courier"
                @click="selectCourier(courier)"
                :class="[
                  'px-4 py-2 rounded border',
                  selectedCourier === courier
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                ]"
              >
                {{ courier }}
              </button>
            </div>
            <button
              v-if="!isGlobalMode"
              @click="applySelectedCourier"
              class="ml-4 px-4 py-2 rounded border bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600 text-sm"
            >
              적용
            </button>
          </div>
        </div>

        <!-- 데이터 입력 -->
        <form @submit.prevent="handleSubmit">
          <table class="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead class="bg-gray-200">
              <tr>
                <th v-if="!isGlobalMode" class="border border-gray-300 px-4 py-3 text-left">선택</th>
                <th class="border border-gray-300 px-4 py-3 text-left">이름</th>
                <th class="border border-gray-300 px-4 py-3 text-left">핸드폰 번호</th>
                <th class="border border-gray-300 px-4 py-3 text-left">송장번호</th>
                <th v-if="!isGlobalMode" class="border border-gray-300 px-4 py-3 text-left">택배 회사</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in rows"
                :key="rowIndex"
                class="hover:bg-gray-100 cursor-pointer"
                :class="{ 'bg-blue-100': selectedRowIndex === rowIndex }"
                @click="selectRow(rowIndex)"
              >
                <td v-if="!isGlobalMode" class="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" v-model="row.checked" />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    v-model="row.name"
                    required
                    class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :ref="el => setRef(el as HTMLInputElement, `name-${rowIndex}`)"
                    @keydown="handleKeydown($event, rowIndex, 'name')"
                  />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <input
                    type="tel"
                    v-model="row.phone"
                    required
                    class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :ref="el => setRef(el as HTMLInputElement, `phone-${rowIndex}`)"
                    @keydown="handleKeydown($event, rowIndex, 'phone')"
                    @input="() => formatPhoneInput(rowIndex)"
                  />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    v-model="row.invoice"
                    required
                    class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :ref="el => setRef(el as HTMLInputElement, `invoice-${rowIndex}`)"
                    @keydown="handleKeydown($event, rowIndex, 'invoice')"
                  />
                </td>
                <td v-if="!isGlobalMode" class="border border-gray-300 px-4 py-2">
                  <select
                    v-model="row.courier"
                    class="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option v-for="courier in couriers" :key="courier" :value="courier">
                      {{ courier }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="submit"
            class="mt-4 px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            고객에게 알림톡으로 택배번호 보내기
          </button>
        </form>
      </div>

<!-- 오른쪽: 미리보기 -->
<div class="w-1/3 pl-4 bg-white shadow rounded p-4">
  <h2 class="text-lg font-bold mb-4">미리보기</h2>

  <div v-if="selectedTemplate">
    <h3 class="text-md font-semibold mb-2 text-gray-700">
      {{ selectedTemplate.templtTitle }}
    </h3>
    <div class="whitespace-pre-line">
  {{ previewContent }}
</div>

  </div>
  <div v-else>
    <p class="text-sm text-gray-500">선택된 템플릿이 없습니다.</p>
  </div>
</div>


    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import { formatPhone } from '@myshared/shared/utils/common/common';
import { createKakaoService } from '@myshared/shared/services/kakao/kakaoService';
import { type Template } from '@/shared-types/kakao/template';

interface Row {
  name: string;
  phone: string;
  invoice: string;
  courier: string;
  checked: boolean;
}

const router = useRouter();
const couriers = ['우체국', '한진', '대한통운'];
const selectedCourier = ref<string>('우체국');
const isGlobalMode = ref<boolean>(true);

const rows = reactive<Row[]>(
  Array.from({ length: 5 }, () => ({
    name: '',
    phone: '010-',
    invoice: '',
    courier: '우체국',
    checked: false,
  }))
);



function selectRow(rowIndex: number) {
  selectedRowIndex.value = rowIndex;
}

const selectedRowIndex = ref<number | null>(null);
const selectedRow = computed(() =>
  selectedRowIndex.value !== null ? rows[selectedRowIndex.value] : null
);

const refs: Record<string, HTMLInputElement> = {};

function toggleMode() {
  if (!isGlobalMode.value) {
    const allMatch = rows.every(row => row.courier === selectedCourier.value);
    if (!allMatch) {
      const confirmChange = window.confirm(`택배회사를 모두 "${selectedCourier.value}"으로 바꾸시겠습니까?`);
      if (confirmChange) {
        rows.forEach(row => row.courier = selectedCourier.value);
        isGlobalMode.value = true;
      }
      return;
    }
  }
  isGlobalMode.value = !isGlobalMode.value;
}

function navigateTo(path: string) {
  router.push(path);
}

function handleLogout() {
  console.log('로그아웃 처리');
}

function handleKeydown(event: KeyboardEvent, rowIndex: number, field: string) {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  const cursorPosition = input.selectionStart ?? 0;
  const isAllSelected = (input.selectionStart === 0 && input.selectionEnd === input.value.length);

  if (key === 'ArrowDown' || key === 'Enter') {
    event.preventDefault();
    const nextRow = rowIndex + 1;
    if (nextRow < rows.length) {
      focusField(nextRow, field);
      selectedRowIndex.value = nextRow;
    } else {
      addRow(field);
      focusField(nextRow, field);
      selectedRowIndex.value = nextRow;
    }
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    const prevRow = rowIndex - 1;
    if (prevRow >= 0) {
      focusField(prevRow, field);
      selectedRowIndex.value = prevRow;
    }
  } else if (key === 'ArrowRight') {
    if (cursorPosition === input.value.length || isAllSelected) {
      if (field === 'name') focusField(rowIndex, 'phone');
      else if (field === 'phone') focusField(rowIndex, 'invoice');
    }
  } else if (key === 'ArrowLeft') {
    if (cursorPosition === 0 || isAllSelected) {
      if (field === 'phone') focusField(rowIndex, 'name');
      else if (field === 'invoice') focusField(rowIndex, 'phone');
    }
  }
}

function focusField(rowIndex: number, field: string) {
  const refName = `${field}-${rowIndex}`;
  nextTick(() => {
    const input = refs[refName];
    if (input) {
      input.focus();
      setTimeout(() => input.select(), 0);
    }
  });
}

function setRef(el: HTMLInputElement | null, refName: string) {
  if (el) refs[refName] = el;
}

function addRow(field: string) {
  rows.push({
    name: '',
    phone: '010-',
    invoice: '',
    courier: isGlobalMode.value ? selectedCourier.value : '우체국',
    checked: false,
  });
  const newRowIndex = rows.length - 1;
  nextTick(() => focusField(newRowIndex, field));
}

function formatPhoneInput(rowIndex: number) {
  rows[rowIndex].phone = formatPhone(rows[rowIndex].phone);
}

function handleSubmit() {
  console.log('입력된 데이터:', rows);
}

function selectCourier(courier: string) {
  selectedCourier.value = courier;
  if (isGlobalMode.value) {
    rows.forEach(row => row.courier = courier);
  }
}

function applySelectedCourier() {
  rows.forEach(row => {
    if (row.checked) row.courier = selectedCourier.value;
  });
}

const templates = ref<Template[]>([]);
const selectedTemplate = ref<Template | null>(null);

async function fetchTemplates() {
  try {
    const authStore = useAuthStore();
    const currentCompany = authStore.currentCompany;

    if (!currentCompany || !currentCompany.kakaoInfo) {
      console.warn('카카오 정보가 없습니다.');
      return;
    }

    const resSenderkey = currentCompany.kakaoInfo.resSenderKey;
    const noticeCode = currentCompany.kakaoInfo.noticeCodeDeliveryStart;

    const result = await createKakaoService().templateList(resSenderkey);
    console.log('템플릿 목록:', result.data.list);
    templates.value = result.data.list;

    selectedTemplate.value =
      templates.value.find((template) => template.templtCode === 'TX_9877') || null;
  } catch (error) {
    console.error('템플릿 목록을 가져오는 중 오류 발생:', error);
  }
}

const previewContent = computed(() => {
  if (!selectedTemplate.value) return '';
  if (!selectedRow.value) return selectedTemplate.value.templtContent;

  return selectedTemplate.value.templtContent
    .replaceAll('#{택배회사명}', selectedRow.value.courier);
});

onMounted(() => {
  fetchTemplates();
  focusField(0, 'name');
  selectedRowIndex.value = 0;
});
</script>


<style scoped>
table td input {
  padding: 2px;
  margin: 0;
  border: none;
  outline: none;
}
table td {
  padding: 0;
}
table th {
  font-weight: bold;
  text-transform: uppercase;
}
table tr:hover {
  background-color: #f9fafb;
}
button {
  transition: background-color 0.2s ease-in-out;
}
</style>
