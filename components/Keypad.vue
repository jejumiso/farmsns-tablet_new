<template>
  <div class="grid grid-cols-3 border-t border-gray-300 h-full">
    <button
      v-for="(num, index) in keypadNumbers"
      :key="index"
      @click="handleClick(num)"
      class="flex justify-center items-center text-3xl font-bold font-[poppins] border border-gray-300"
      :class="{
        'bg-sky-500/50 text-white': num === '확인', // 확인 버튼 스타일
        'bg-white text-black': num !== '확인', // 기본 버튼 스타일
      }"
    >
      {{ num }}
    </button>
  </div>
</template>

<script setup lang="ts">
// defineProps와 defineEmits의 import 제거
const props = defineProps({
  keypadNumbers: {
    type: Array as () => (string | number)[], // 키패드 숫자 배열 타입 지정
    default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '확인'],
  },
});

const emit = defineEmits<{
  (event: 'keypadClick', key: string | number): void;
}>();

const handleClick = (key: string | number) => {
  emit('keypadClick', key);
};
</script>

<style scoped>
/* Tailwind CSS로 스타일링하므로 추가 스타일은 필요하지 않습니다. */
</style>
