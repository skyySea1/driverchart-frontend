<template>
  <div>
    <label class="block text-xs font-bold text-slate-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :required="required"
      class="input-base"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    modelValue: string | number
    placeholder?: string
    type?: string
    required?: boolean
  }>(),
  {
    type: 'text',
    required: false,
    placeholder: '',
  },
)

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>
