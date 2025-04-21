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
      <FormInput label="단축 상품명" v-model="product.productNameShort" id="productNameShort" />



      <FormInput label="단위" v-model="product.unit" id="unit" />
      <!-- 설명 -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">상품 설명</label>
        <textarea v-model="product.description" id="description" rows="3" class="w-full mt-2 p-2 border rounded" />
      </div>
    </div>
    <div v-if="currentTab === '이미지'" class="space-y-4"> 
      <div>
<!-- 이미지 업로드 -->

<ImageUploader
  v-model="product.imageGalleryFileNames"
  :imageType="'product'"
  :companyId="companyId??''"
  :maxCount="5"
  :maxSizeKb="512"           
  :maxWidth="1000"      
  :maxHeight="1000"    
  :minWidth="30"           
  :minHeight="30"          
/>

<br />
<!-- 이미지 리스트 + 썸네일 지정 -->
<ImageList
  v-model="product.imageGalleryFileNames"
  v-model:thumbnail="product.imageThumbnailFileName"
    :imageType="'product'"
  :companyId="companyId??''"
  :showControls="true"
/>

    

      </div>
    </div>

    <!-- 가격 정보 -->
    <div v-else-if="currentTab === '가격 정보'" class="space-y-4">
      <FormInput label="정상 가격" v-model="product.priceOriginal" id="priceOriginal" type="number" required />
      <FormInput label="할인 가격" v-model="product.priceDiscounted" id="priceDiscounted" type="number" />
    </div>

    <!-- 진열 관련 -->
    <div v-else-if="currentTab === '재고 및 진열'" class="space-y-4">
      <FormInput label="재고 수량" v-model="product.stockQuantity" id="stockQuantity" type="number" />
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="product.isVisible" id="isVisible" />
        <label for="isVisible">진열 중</label>
      </div>
      <FormInput label="진열 우선순위" v-model="product.displayLevel" id="displayLevel" type="number" />
    </div>

    <!-- 탭: 옵션 설정 -->
    <div v-else-if="currentTab === '옵션 설정'" class="space-y-4">
      <FormInput label="옵션 그룹 ID" v-model="product.optionGroupId" id="optionGroupId" />
      <FormInput label="옵션 IDs (쉼표 구분)" v-model="optionIdsInput" id="optionIds" />
    </div>

    <!-- 탭: 보상 설정 -->
    <div v-else-if="currentTab === '보상 설정'" class="space-y-4">
      <FormInput label="적립 스탬프" v-model="product.rewardStamp" id="rewardStamp" type="number" />
      <FormInput label="적립 포인트" v-model="product.rewardPoint" id="rewardPoint" type="number" />
    </div>


    <!-- 탭: 고급 설정 -->
    <div v-else-if="currentTab === '고급 설정'" class="space-y-4">
      <FormInput label="상위 상품 ID" v-model="product.parentProductId" id="parentProductId" />
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="product.useParentData" id="useParentData" />
        <label for="useParentData">상위 상품 정보 사용</label>
      </div>
      <div>
        <label for="categories" class="block text-sm font-medium text-gray-700">카테고리 (쉼표 구분)</label>
        <input v-model="categoriesInput" id="categories" class="w-full mt-2 p-2 border rounded" />
      </div>
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="product.isPrivateProduct" id="isPrivateProduct" />
        <label for="isPrivateProduct">비공개 상품</label>
      </div>
    </div>

    <!-- 저장 버튼 -->
    <div class="mt-6 flex justify-end">
      <button type="submit" 
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      :disabled="loading">
        {{ isEditMode ? '수정' : '추가' }}하기
      </button>
        <!-- ✅ 삭제 버튼 (수정 모드일 때만 표시) -->
        <button
          v-if="isEditMode"
          type="button"
          class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 hover:bg-red-700"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      :disabled="loading"
      @click="confirmDelete">
          삭제하기
        </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Product } from '@/shared-types/product/product';
import FormInput from '@/components/common/FormInput.vue';
import ImageUploader from '@/components/common/ImageUploader.vue';
import ImageList from '@/components/common/ImageList.vue';
import { getCompanyId } from '~/utils/getCompanyId';

const props = defineProps<{
  product: Product;
  isEditMode: boolean;
  loading: boolean;
}>();
const galleryImages = ref<string[]>([])
const thumbnail = ref('')
const companyId = getCompanyId();

const tabs = [
  '기본 정보',
  '이미지',
  '가격 정보',
  '재고 및 진열',
  '옵션 설정',
  '보상 설정',
  '고급 설정',
];
const currentTab = ref(tabs[0]);





// 옵션 ID 입력 처리
const optionIdsInput = ref(props.product.optionIds.join(','));
watch(optionIdsInput, (val) => {
  props.product.optionIds = val.split(',').map((s) => s.trim()).filter(Boolean);
});

// 이미지 URL 배열 처리
const imageDetailUrlsInput = ref(props.product.imageGalleryFileNames.join(','));
watch(imageDetailUrlsInput, (val) => {
  props.product.imageGalleryFileNames = val.split(',').map((s) => s.trim()).filter(Boolean);
});

// 카테고리 처리
const categoriesInput = ref(props.product.categories.join(','));
watch(categoriesInput, (val) => {
  props.product.categories = val.split(',').map((s) => s.trim()).filter(Boolean);
});

const emit = defineEmits<{
  (e: 'submit', product: Product): void;
  (e: 'delete'): void // ✅ 삭제 이벤
}>();
const confirmDelete = async () => {
  emit('delete'); // 실제 삭제는 edit/[id].vue에서

};
const submitForm = () => {
  
  emit('submit', props.product);
};


</script>
