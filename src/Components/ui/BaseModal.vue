<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static backdrop-blur-sm"
    >
      <div
        :class="[
          'bg-white  shadow-2xl w-full overflow-y-auto max-h-[95vh] print:shadow-none print:w-full print:max-w-none print:max-h-none transform transition-all',
          size,
        ]"
      >
        <div
          class="bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-800 print:hidden"
        >
          <h3 class="text-white font-bold text-lg">{{ title }}</h3>
          <div class="flex items-center space-x-4">
            <slot name="actions"></slot>
            <button
              @click="emit('close')"
              class="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="p-6 print:p-0">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps<{
  title: string
  size?: string
  isOpen: boolean
}>()

function escListener(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    // If multiple modals are open, checking z-index is hard programmatically without a store.
    // However, since BaseModal is usually a leaf or specific portal, standard event bubbling applies.
    // If we want "Top-most" only, we rely on the fact that the most recently mounted listener handles it?
    // Listeners fire in registration order.
    // A simple way to handle "only top most" in a global listener approach is tricky without a stack manager.
    // But for the requirement "double click to close all", that implies a specific behavior not covered by standard ESC.
    // Assuming standard ESC behavior closes the modal.
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', escListener))
onUnmounted(() => document.removeEventListener('keydown', escListener))
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
