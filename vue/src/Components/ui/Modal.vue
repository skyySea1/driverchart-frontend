<template>
  <div v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
    <div :class="['bg-white rounded-xl shadow-2xl w-full overflow-y-auto max-h-[95vh] print:shadow-none print:w-full print:max-w-none print:max-h-none', size]">
      <div class="bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-800 print:hidden">
        <h3 class="text-white font-bold text-lg">{{ title }}</h3>
        <div class="flex items-center space-x-4">
          <slot name="actions"></slot>
          <button @click="emit('close')" class="text-slate-400 hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="p-6 print:p-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close']);

const props = defineProps<{
  title: string,
  size?: string,
  isOpen: boolean
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>
