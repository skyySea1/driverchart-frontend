<template>
  <div>
    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :required="required"
      class="w-full text-sm border bg-white border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
const { type ="text", required = false, placeholder = '' } =
  defineProps<{
    label: string
    modelValue: string | undefined
    placeholder?: string
    type?: string
    required?: boolean
  }>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>
