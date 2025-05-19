<!-- 📁 components\Keypad.vue -->
<template>
  <div class="grid grid-cols-3 border-t border-gray-300 h-full">
    <button
      v-for="(num, index) in keypadNumbers"
      :key="index"
      @click="handleClick(num)"
      class="flex justify-center items-center text-3xl font-bold font-[poppins] border border-gray-300"
      :class="{
        'bg-sky-500/50 text-white': num === '확인',
        'bg-white text-black': num !== '확인',
        'opacity-50 cursor-not-allowed': num === '확인' && isSubmitting
      }"
      :disabled="num === '확인' && isSubmitting"
    >
      <template v-if="num === '확인'">
        <span v-if="isSubmitting">⏳</span>
        <span v-else>확인</span>
      </template>
      <template v-else>
        {{ num }}
      </template>
    </button>
  </div>
</template>


<script setup lang="ts">
const props = defineProps({
  keypadNumbers: {
    type: Array as () => (string | number)[],
    default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '확인'],
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (event: 'keypadClick', key: string | number): void;
}>();

const handleClick = (key: string | number) => {
  emit('keypadClick', key);
};
</script>

<style scoped>
/* Tailwind 기반이므로 커스텀 스타일 생략 가능 */
</style>
