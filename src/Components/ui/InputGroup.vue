<template>
  <div>
    <label class="block text-xs font-bold text-slate-700 mb-1">
      {{ label }}
       <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :required="required"
      :disabled="disabled"
      class="input-base disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

const { type = "text", required = false, placeholder = '', disabled = false } =
  defineProps<{
    label: string
    modelValue: string | undefined
    placeholder?: string
    type?: InputTypeHTMLAttribute
    required?: boolean
    disabled?: boolean
  }>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>
