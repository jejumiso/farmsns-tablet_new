<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="id" class="w-32 text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="localValue"
      @input="updateValue"
      :required="required"
      class="flex-1 p-2 border rounded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  label: string;
  modelValue: string | number | undefined; // ← 여기!
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}>()

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
