<template>
  <div v-if="open" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
      <h3 class="text-lg font-bold text-red-600 flex items-center gap-2">
        <slot name="icon">
          <Trash2 class="w-5 h-5" />
        </slot>
        {{ props.title }}
      </h3>
      <p class="mt-3 text-slate-600">
        <slot name="message">
          Are you sure you want to delete
          <strong>{{ props.name }}</strong
          >? <br />This action is permanent and cannot be undone.
        </slot>
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow cursor-pointer"
        >
          Delete permanently
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  name?: string
  title?: string
}>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>
