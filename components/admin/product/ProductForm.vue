<template>
  <form @submit.prevent="submitForm">
    <!-- 탭 버튼 -->
    <div class="flex gap-2 mb-4 border-b overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="px-4 py-2 whitespace-nowrap"
        :class="currentTab === tab ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 탭: 기본 정보 -->
    <div v-if="currentTab === '기본 정보'" class="space-y-4">
      <FormInput label="상품명" v-model="product.productName" id="productName" required />
      <FormInput label="상품명(약식)" v-model="product.productNameShort" id="productNameShort" />
      <FormInput label="이미지 URL" v-model="product.imgUrl" id="imgUrl" />
      <FormInput label="단위" v-model="product.unit" id="unit" />
      <div>
        <label for="explanation" class="block text-sm font-medium text-gray-700">상품 설명</label>
        <textarea v-model="product.explanation" id="explanation" rows="3" class="w-full mt-2 p-2 border rounded" />
      </div>
    </div>

    <!-- 탭: 가격 정보 -->
    <div v-else-if="currentTab === '가격 정보'" class="space-y-4">
      <FormInput label="정상 가격" v-model="product.priceOri" id="priceOri" type="number" required />
      <FormInput label="짧은 가격" v-model="product.priceShort" id="priceShort" />
      <FormInput label="할인 가격" v-model="product.priceSale" id="priceSale" type="number" />
    </div>

    <!-- 탭: 재고 및 진열 -->
    <div v-else-if="currentTab === '재고 및 진열'" class="space-y-4">
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="product.stockStatus" id="stockStatus" />
        <label for="stockStatus">재고 있음</label>
      </div>
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="product.isDisplay" id="isDisplay" />
        <label for="isDisplay">진열 중</label>
      </div>
      <FormInput label="진열 우선순위" v-model="product.displayLevel" id="displayLevel" type="number" />
    </div>

    <!-- 탭: 옵션 설정 -->
    <div v-else-if="currentTab === '옵션 설정'" class="space-y-4">
      <FormInput label="옵션 그룹 ID" v-model="product.optionGroupId" id="optionGroupId" />
      <FormInput label="옵션 그룹명" v-model="product.optionGroupName" id="optionGroupName" />
      <FormInput label="옵션 IDs (쉼표 구분)" v-model="optionIdsInput" id="optionIds" />
    </div>

    <!-- 탭: 보상 설정 -->
    <div v-else-if="currentTab === '보상 설정'" class="space-y-4">
      <FormInput label="적립 스탬프" v-model="product.rewardStamp" id="rewardStamp" type="number" />
      <FormInput label="적립 포인트" v-model="product.rewardPoint" id="rewardPoint" type="number" />
    </div>

    <!-- 탭: 특가 설정 -->
    <div v-else-if="currentTab === '특가 설정'" class="space-y-4">
      <FormInput label="특가 가격" v-model="product.specialPrice" id="specialPrice" type="number" />
      <FormInput label="특가 사용제한 수량" v-model="product.specialUsedQty" id="specialUsedQty" type="number" />
    </div>

    <!-- 저장 버튼 -->
    <div class="mt-6 flex justify-end">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
        {{ isEditMode ? '수정' : '추가' }}하기
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Product } from '@/shared-types/product/product';
import FormInput from '@/components/common/FormInput.vue';

const props = defineProps<{
  product: Product;
  isEditMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', product: Product): void;
}>();

// 탭 구성
const tabs = [
  '기본 정보',
  '가격 정보',
  '재고 및 진열',
  '옵션 설정',
  '보상 설정',
  '특가 설정',
];
const currentTab = ref(tabs[0]);

// 옵션 ID 문자열 입력 처리
const optionIdsInput = ref(props.product.optionIds.join(','));
watch(optionIdsInput, (val) => {
  props.product.optionIds = val.split(',').map((s) => s.trim()).filter(Boolean);
});

// 제출
const submitForm = () => {
  emit('submit', props.product);
};
</script>
