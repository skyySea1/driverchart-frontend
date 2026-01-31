<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <label :class="['block text-xs font-bold text-slate-700', labelClass]">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>

      <!-- Optional Toggle Checkbox -->
      <label v-if="enableCheck" class="flex items-center gap-1 cursor-pointer" :title="toggleTitle">
        <input
          type="checkbox"
          :checked="checkboxValue"
          @change="$emit('update:checkboxValue', ($event.target as HTMLInputElement).checked)"
          class="w-4 h-4 rounded border-slate-300 cursor-pointer"
        />
        <span class="text-[10px] text-slate-600 font-semibold uppercase tracking-tight">{{
          checkboxTitle || 'undefined checkboxTitle'
        }}</span>
      </label>

      <!-- Tooltip -->
      <div v-if="tooltip" class="group relative flex items-center">
        <HelpCircle class="w-3 h-3 text-slate-400 cursor-help" />
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-10 text-center pointer-events-none"
        >
          {{ tooltip }}
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"
          ></div>
        </div>
      </div>
    </div>
    <!--review why this use dynamic class binding -->
    <input
      :type="type"
      :required="required"
      :disabled="disabled || (enableCheck && !isEnabled)"
      class="input-base disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors duration-200"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': error }"
      :placeholder="placeholder"
      :value="modelValue"
      :maxlength="maxlength"
      @input="handleInput"
    />
    <p v-if="error" class="text-[10px] text-red-500 font-semibold mt-1 animate-pulse">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { formatSSN } from '@/utils/utils'

const props = defineProps<{
  label: string
  modelValue: string | number | undefined
  placeholder?: string
  type?: InputTypeHTMLAttribute
  required?: boolean
  disabled?: boolean
  tooltip?: string
  enableCheck?: boolean
  isEnabled?: boolean
  checkboxValue?: boolean
  toggleTitle?: string
  checkboxTitle?: string
  labelClass?: string
  error?: string
  maxlength?: string | number
  isSSN?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'update:isEnabled', value: boolean): void
  (e: 'update:checkboxValue', value: boolean): void
}>()

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  if (props.type === 'tel') {
    // Format Phone: (XXX) XXX-XXXX
    let numbers = value.replace(/\D/g, '')
    if (numbers.length > 10) numbers = numbers.slice(0, 10)

    // As the user types, progressively apply the final format:
    // (XXX) XXX-XXXX

    if (numbers.length > 6) {
      value = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`
    } else if (numbers.length > 3) {
      value = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else if (numbers.length > 0) {
      value = `(${numbers}`
    } else {
      value = numbers
    }
  }

  if (props.isSSN) {
    value = formatSSN(value)
  }

  emit('update:modelValue', value)
}
</script>
