<template>
  <div class="flex gap-6">
    <div class="w-1/2">
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
          <FormInput label="옵션 이름" v-model="option.optionName" id="optionName" required />
          <FormInput label="스타일 타입" v-model="option.styleType" id="styleType" />
          <FormInput label="안내 메시지" v-model="option.msg" id="msg" />
          <FormInput label="표시 순서" v-model="option.displayLevel" id="displayLevel" type="number" />

          <div class="flex items-center gap-4 mb-2">
            <label for="optionType" class="w-32 text-sm font-medium text-gray-700">옵션 타입</label>
            <select id="optionType" v-model="option.type" class="flex-1 p-2 border rounded">
              <option value="select">선택</option>
              <option value="check">체크</option>
              <option value="quantity">수량</option>
            </select>
          </div>

          <FormInput label="옵션 항목 (쉼표로 구분)" v-model="optionItemsInput" id="optionItems" />

          <div>
            <FormInput label="항목별 가격 (쉼표로 구분)" v-model="optionItemsPriceInput" id="optionItemsPrice" />
          </div>
        </div>

        <div v-if="activeTab === '상속 설정' && option.parentOptionId" class="space-y-4">
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="option.useParentData" id="useParentData" />
            <label for="useParentData">상위 옵션 데이터 사용</label>
          </div>
          <FormInput label="부모 옵션 ID" v-model="option.parentOptionId" id="parentOptionId" disabled />
        </div>

        <div v-if="activeTab === '특수 기능'">
          <h3 class="font-medium text-gray-800">현재 옵션 항목</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <label v-for="item in option.optionItems" :key="item" class="flex items-center gap-2">
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
          <div v-if="option.invalidCombinations?.length">
            <h4 class="font-semibold mt-4">저장된 충돌 조합</h4>
            <ul class="list-disc ml-6 mt-2 text-sm text-gray-700">
              <li
                v-for="(comb, idx) in option.invalidCombinations"
                :key="idx"
              >
                <strong>이 옵션:</strong> {{ comb.thisValue.join(', ') }}  
                <strong>금지 조합:</strong> {{ comb.otherValue.join(', ') }}  
                <span class="text-gray-400">({{ getOptionNameById(comb.optionId) }})</span>
                <button @click="removeCombination(idx)" class="ml-2 text-red-500 hover:underline">삭제</button>

              </li>
            </ul>
          </div>

        </div>

        <div class="flex justify-end pt-4">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            {{ isEditMode ? '수정' : '추가' }}하기
          </button>
            <!-- 삭제 버튼 (수정 모드일 때만 표시) -->
            <button
              v-if="isEditMode"
              type="button"
              class="px-4 py-2 bg-red-500 text-white rounded"
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
        :currentOptionId="option.id"
        :otherOptions="otherOptions"
        :selectedOptionId="selectedOtherOption?.id || ''"
        @select="selectedOtherOption = $event"
      />
      <OptionPreview v-else :option="option" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import type { Option } from '@/shared-types/option/option';
import FormInput from '@/components/common/FormInput.vue';
import OptionPreview from './OptionPreview.vue';
import OptionListView from './OptionListView.vue';
import { useRouter } from 'vue-router';
import { useOptionStore } from '@/stores/option/useOptionStore';

const router = useRouter();
const optionStore = useOptionStore();
const props = defineProps<{
  option: Option;
  isEditMode: boolean;
  otherOptions: Option[];
}>();

const emit = defineEmits<{ (e: 'submit', option: Option): void }>();

const tabs = ['기본 설정', '상속 설정', '특수 기능'];
const activeTab = ref(tabs[0]);
const selectedThisValues = ref<string[]>([]);
const selectedOtherOption = ref<Option | null>(null);
const selectedOtherValues = ref<string[]>([]);

const optionItemsInput = ref(props.option.optionItems.join(','));
const optionItemsPriceInput = ref(props.option.optionItemsPrice.join(','));

watch(optionItemsInput, (val) => {
  props.option.optionItems = val.split(',').map(i => i.trim());
});
watch(optionItemsPriceInput, (val) => {
  props.option.optionItemsPrice = val.split(',').map(i => parseInt(i.trim()) || 0);
});

const canAddCombination = computed(() => {
  return (
    selectedThisValues.value.length > 0 &&
    selectedOtherOption.value &&
    selectedOtherValues.value.length > 0
  );
});

const addInvalidCombination = () => {
  if (!selectedOtherOption.value) {
    alert('다른 옵션을 먼저 선택해주세요.');
    return;
  }

  if (selectedThisValues.value.length === 0) {
    alert('현재 옵션 항목에서 최소 1개 이상 선택해야 합니다.');
    return;
  }

  if (selectedOtherValues.value.length === 0) {
    alert('다른 옵션 항목에서 최소 1개 이상 선택해야 합니다.');
    return;
  }

  const newCombination = {
    optionId: selectedOtherOption.value.id,
    thisValue: [...selectedThisValues.value],
    otherValue: [...selectedOtherValues.value],
    warningMsg: '해당 조합은 사용할 수 없습니다.', // 나중에 입력 UI 추가 가능
  };

  if (!props.option.invalidCombinations) {
    props.option.invalidCombinations = [];
  }

  props.option.invalidCombinations.push(newCombination);

  // 선택 초기화
  selectedThisValues.value = [];
  selectedOtherValues.value = [];
  selectedOtherOption.value = null;
};


const getOptionNameById = (id: string): string => {
  const found = props.otherOptions.find(opt => opt.id === id);
  return found?.optionName || '(옵션 없음)';
};
const removeCombination = (index: number) => {
  props.option.invalidCombinations?.splice(index, 1);
};

const confirmDelete = async () => {
  const confirmed = confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
  if (!confirmed) return;

  const res = await optionStore.deleteOption(props.option.id);
  if (res.isSuccess) {
    alert('✅ 삭제되었습니다.');
    router.push('/admin/option');
  } else {
    alert('❌ 삭제 실패: ' + (res.message || '알 수 없는 오류'));
  }
};
const submitForm = () => {
  emit('submit', props.option);
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>