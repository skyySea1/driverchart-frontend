<template>
  <div>
    <label class="block text-xs font-medium text-slate-700 mt-1 mb-1">{{ label }}</label>
    <div class="flex items-center space-x-2">
      <label
        class="cursor-pointer flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 w-full transition-colors group"
      >
        <Upload class="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500" />
        <span v-if="type==='button'" class="truncate max-w-37.5">{{ fileName || 'Upload Document' }}</span>
        <input type="file" class="hidden" @change="handleChange" />
      </label>
      <CheckCircle v-if="fileName" class="w-5 h-5 text-purple-600 shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, CheckCircle } from 'lucide-vue-next'

withDefaults(defineProps<{
  label?: string
  fileName?: string
  type?: 'button' | 'input'
}>(), {
  type: 'button'
})

const emit = defineEmits<{
  (e: 'change', event: Event): void
  (e: 'update:fileName', value: string): void // Optional for name two-way binding
}>()

function handleChange(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return

  const file = event.target.files?.[0]
  if (!file) return

  emit('change', event)
  emit('update:fileName', file.name)
}
</script>
