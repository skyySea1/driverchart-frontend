<template>
  <div>
    <div class="flex items-center gap-1 mb-1">
      <label class="block text-xs font-bold text-slate-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>

      <!-- Tooltip -->
      <div v-if="tooltip" class="group relative flex items-center">
        <HelpCircle class="w-3 h-3 text-slate-400 cursor-help" />
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-10 text-center pointer-events-none">
          {{ tooltip }}
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      </div>
    </div>

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
import { HelpCircle } from 'lucide-vue-next';

const { type = "text", required = false, placeholder = '', disabled = false, tooltip = '' } =
  defineProps<{
    label: string
    modelValue: string | undefined
    placeholder?: string
    type?: InputTypeHTMLAttribute
    required?: boolean
    disabled?: boolean
    tooltip?: string
  }>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>
