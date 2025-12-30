<template>
  <div >
    <label class="block text-xs font-medium text-slate-500 mb-1">{{ label }}</label>
    <div class="flex items-center space-x-2">
      <label
        class="cursor-pointer flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 w-full transition-colors group"
      >
        <Upload class="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500" />
        <span class="truncate max-w-37.5">{{ fileName || 'Upload Document' }}</span>
        <input type="file" class="hidden" @change="handleChange" />
      </label>
      <CheckCircle v-if="fileName" class="w-5 h-5 text-purple-600 shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, CheckCircle } from 'lucide-vue-next'

defineProps<{
  label: string
  fileName?: string
}>()

const emit = defineEmits<{
  (e: 'change', event: Event): void
  (e: 'update:fileName', value: string): void // Optional for name two-way binding
}>()

function handleChange(event: Event) {
  emit('change', event)
  // Optional: Update the file name if using v-model
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    // todo: handle multiple files if needed
  }
}
</script>
