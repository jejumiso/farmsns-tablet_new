<template>
  <div class="flex gap-6">
    <div class="w-1/2">
      <!-- 탭 버튼 -->
      <div class="flex space-x-4 border-b mb-4">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'py-2 px-4 font-semibold',
            activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          ]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div v-if="activeTab === '기본 설정'" class="space-y-4">
          <FormInput label="옵션 이름" v-model="localOption.optionName" id="optionName" required />
          <FormInput label="스타일 타입" v-model="localOption.styleType" id="styleType" />
          <FormInput label="안내 메시지" v-model="localOption.msg" id="msg" />
          <FormInput label="표시 순서" v-model="localOption.displayLevel" id="displayLevel" type="number" />

          <div class="flex items-center gap-4 mb-2">
            <label for="optionType" class="w-32 text-sm font-medium text-gray-700">옵션 타입</label>
            <select id="optionType" v-model="localOption.type" class="flex-1 p-2 border rounded">
              <option value="select">선택</option>
              <option value="check">체크</option>
              <option value="quantity">수량</option>
            </select>
          </div>

          <FormInput label="옵션 항목 (쉼표 구분)" v-model="optionItemsInput" id="optionItems" />
          <FormInput label="항목별 가격 (쉼표 구분)" v-model="optionItemsPriceInput" id="optionItemsPrice" />
        </div>

        <div v-if="activeTab === '상속 설정' && localOption.parentOptionId" class="space-y-4">
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="localOption.useParentData" id="useParentData" />
            <label for="useParentData">상위 옵션 데이터 사용</label>
          </div>
          <FormInput label="부모 옵션 ID" v-model="localOption.parentOptionId" id="parentOptionId" disabled />
        </div>

        <div v-if="activeTab === '특수 기능'">
          <h3 class="font-medium text-gray-800">현재 옵션 항목</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <label v-for="item in localOption.optionItems" :key="item" class="flex items-center gap-2">
              <input type="checkbox" :value="item" v-model="selectedThisValues" />
              {{ item }}
            </label>
          </div>

          <div v-if="selectedOtherOption">
            <h3 class="font-medium text-gray-800">선택된 다른 옵션 항목</h3>
            <div class="flex flex-wrap gap-2">
              <label v-for="item in selectedOtherOption.optionItems" :key="item" class="flex items-center gap-2">
                <input type="checkbox" :value="item" v-model="selectedOtherValues" />
                {{ item }}
              </label>
            </div>
          </div>

          <FormInput label="경고 메시지" v-model="warningMsg" id="warningMsg" />

          <button
            type="button"
            :class="[
              'px-4 py-2 rounded transition',
              canAddCombination
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
            @click="addInvalidCombination"
          >
            조합 추가
          </button>

          <div v-if="localOption.invalidCombinations?.length">
            <h4 class="font-semibold mt-4">저장된 충돌 조합</h4>
            <ul class="list-disc ml-6 mt-2 text-sm text-gray-700">
              <li
                v-for="(comb, idx) in localOption.invalidCombinations"
                :key="idx"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <strong>이 옵션:</strong> {{ comb.thisValue.join(', ') }}  
                    <strong>금지 조합:</strong> {{ comb.otherValue.join(', ') }}  
                    <span class="text-gray-400">({{ getOptionNameById(comb.optionId) }})</span>
                  </div>
                  <button type="button"
                  @click="removeCombination(idx)" class="ml-2 text-red-500 hover:underline">삭제</button>
                </div>
                <input
                  v-model="comb.warningMsg"
                  class="mt-1 w-full border p-1 rounded text-sm"
                  placeholder="경고 메시지 입력"
                />
              </li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            {{ isEditMode ? '수정' : '추가' }}하기
          </button>
          <button
            v-if="isEditMode"
            type="button"
            class="px-4 py-2 bg-red-500 text-white rounded ml-2"
            @click="confirmDelete"
          >
            삭제하기
          </button>
        </div>
      </form>
    </div>

    <div class="w-1/2">
      <OptionListView
        v-if="activeTab === '특수 기능'"
        :currentOptionId="localOption.id"
        :otherOptions="otherOptions"
        :selectedOptionId="selectedOtherOption?.id || ''"
        @select="selectedOtherOption = $event"
      />
      <OptionPreview v-else :option="localOption" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Option } from '@/shared-types/option/option';
import FormInput from '@/components/common/FormInput.vue';
import OptionPreview from './OptionPreview.vue';
import OptionListView from './OptionListView.vue';

const props = defineProps<{
  option: Option;
  isEditMode: boolean;
  loading: boolean;
  otherOptions: Option[];
}>();

const emit = defineEmits<{
  (e: 'submit', option: Option): void;
  (e: 'delete'): void;
}>();

const warningMsg = ref('해당 조합은 사용할 수 없습니다.');

const localOption = ref<Option>(JSON.parse(JSON.stringify(props.option)));

const tabs = ['기본 설정', '상속 설정', '특수 기능'];
const activeTab = ref(tabs[0]);
const selectedThisValues = ref<string[]>([]);
const selectedOtherOption = ref<Option | null>(null);
const selectedOtherValues = ref<string[]>([]);

const optionItemsInput = ref(localOption.value.optionItems.join(','));
const optionItemsPriceInput = ref(localOption.value.optionItemsPrice.join(','));

watch(optionItemsInput, (val) => {
  localOption.value.optionItems = val.split(',').map(i => i.trim());
});
watch(optionItemsPriceInput, (val) => {
  localOption.value.optionItemsPrice = val.split(',').map(i => parseInt(i.trim()) || 0);
});

const canAddCombination = computed(() => {
  return (
    selectedThisValues.value.length > 0 &&
    selectedOtherOption.value &&
    selectedOtherValues.value.length > 0
  );
});

const addInvalidCombination = () => {
  const newCombination = {
    optionId: selectedOtherOption.value!.id,
    thisValue: [...selectedThisValues.value],
    otherValue: [...selectedOtherValues.value],
    warningMsg: warningMsg.value,
  };

  localOption.value.invalidCombinations = [
    ...(localOption.value.invalidCombinations ?? []),
    newCombination
  ];

  selectedThisValues.value = [];
  selectedOtherValues.value = [];
  selectedOtherOption.value = null;
  warningMsg.value = '해당 조합은 사용할 수 없습니다.';
};

const removeCombination = (index: number) => {
  localOption.value.invalidCombinations = localOption.value.invalidCombinations?.filter(
    (_, i) => i !== index
  ) ?? [];
};

const getOptionNameById = (id: string) => {
  const found = props.otherOptions.find(o => o.id === id);
  return found?.optionName || '(옵션 없음)';
};

const submitForm = () => {
  emit('submit', localOption.value);
};

const confirmDelete = () => {
  emit('delete');
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
