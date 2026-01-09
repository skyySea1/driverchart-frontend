<!-- DocumentActions.vue -->
<template>
  <div v-if="hasDate" class="flex gap-1">
    <button
      v-cursor
      type="button"
      @click="$emit('upload')"
      class="p-1.5 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
      :title="`Upload ${label}`"
    >
      <Upload class="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600" />
    </button>

    <button
      v-cursor
      type="button"
      @click="$emit('download')"
      class="p-1.5 rounded-md bg-white border border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all group"
      :title="`Download ${label}`"
    >
      <Download class="w-3.5 h-3.5 text-slate-500 group-hover:text-green-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Upload, Download } from 'lucide-vue-next'

defineProps<{
  hasDate: boolean
  label: string
}>()

defineEmits<{
  upload: []
  download: []
}>()
</script>
