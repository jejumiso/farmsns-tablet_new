<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full mt-2 p-2 border rounded"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    label: string;
    modelValue: string | number | undefined; // ← 여기!

    id: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  </script>
  