<template>
  <div class="bg-gray-50 p-4 rounded shadow w-full">
    <h2 class="text-lg font-bold mb-4 text-gray-800">옵션 미리보기</h2>

    <!-- 옵션 제목 -->
    <div class="mb-4">
      <p class="font-semibold">{{ option.optionName }}</p>
      <p class="text-sm text-gray-500">{{ option.msg }}</p>
    </div>

    <!-- 옵션 항목 렌더링 -->
    <div>
      <!-- 선택형 옵션 (select): 하나만 선택 가능 -->
      <template v-if="option.type === 'select'">
        <div
          v-for="(item, index) in option.optionItems"
          :key="item"
          class="flex items-center gap-2 mb-2"
        >
          <input
            type="radio"
            :id="`select-${index}`"
            :name="option.id"
            :value="item"
            v-model="selectedRadio"
          />
          <label :for="`select-${index}`">
            {{ item }}
            <span v-if="option.optionItemsPrice[index] && option.optionItemsPrice[index] > 0">
              (+{{ option.optionItemsPrice[index] }}원)
            </span>
          </label>
        </div>
      </template>

      <!-- 체크박스 옵션 (check): 다중 선택 가능 -->
      <template v-else-if="option.type === 'check'">
        <div
          v-for="(item, index) in option.optionItems"
          :key="item"
          class="flex items-center gap-2 mb-2"
        >
          <input
            type="checkbox"
            :id="`check-${index}`"
            :value="item"
            v-model="checkedItems"
          />
          <label :for="`check-${index}`">
            {{ item }}
            <span v-if="option.optionItemsPrice[index] && option.optionItemsPrice[index] > 0">
              (+{{ option.optionItemsPrice[index] }}원)
            </span>
          </label>
        </div>
      </template>

      <!-- 수량 입력 옵션 (quantity) -->
      <template v-else-if="option.type === 'quantity'">
        <div class="space-y-2">
          <div
            v-for="(item, index) in option.optionItems"
            :key="index"
            class="flex items-center gap-3"
          >
            <label :for="`qty-${index}`" class="w-32">{{ item }}</label>
            <input
              type="number"
              :id="`qty-${index}`"
              v-model.number="quantities[index]"
              min="0"
              class="border rounded px-2 py-1 w-24"
            />
            <span class="text-sm text-gray-600">
              단가: {{ option.optionItemsPrice[index] || 0 }}원
            </span>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Option } from '@/shared-types/option/option';

const props = defineProps<{ option: Option }>();

// select일 경우 하나만 선택
const selectedRadio = ref('');

// check일 경우 여러 개 선택
const checkedItems = ref<string[]>([]);

// quantity
const quantity = ref(1);

// 수량 단가 계산용 (항목이 1개일 경우 그 가격으로 간주)
const singleItemPrice = computed(() => {
  return props.option.optionItemsPrice[0] || 0;
});
const quantities = ref<number[]>(
  props.option.optionItems.map(() => 0)
);

// 강제 선택 (select에서 항목이 1개일 경우)
watch(
  () => props.option,
  (option) => {
    if (option.type === 'select' && option.optionItems.length === 1) {
      selectedRadio.value = option.optionItems[0];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
label {
  font-size: 0.95rem;
  color: #374151;
}
</style>
