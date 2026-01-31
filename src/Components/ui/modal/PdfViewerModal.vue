<template>
  <BaseModal :isOpen="isOpen" :title="title" size="max-w-5xl" @close="$emit('close')">
    <div
      class="h-[80vh] w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner"
    >
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        class="w-full h-full border-none"
        title="PDF Viewer"
      ></iframe>
      <div v-else class="flex items-center justify-center h-full text-slate-500 font-medium">
        No document to display.
      </div>
    </div>

    <template #actions>
      <BaseButton
        v-if="pdfUrl"
        label="Download"
        :icon="Download"
        class="bg-slate-800 text-white hover:bg-slate-700 h-9 px-4 rounded-lg flex items-center gap-2 text-sm transition-all"
        @click="downloadPdf"
      />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../modal/BaseModal.vue'
import BaseButton from '../buttons/BaseButton.vue'
import { Download } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  pdfUrl: string
  title: string
}>()

defineEmits(['close'])

function downloadPdf() {
  if (!props.pdfUrl) return
  const link = document.createElement('a')
  link.href = props.pdfUrl
  link.target = '_blank'
  link.download = props.title || 'document.pdf'
  link.click()
}
</script>
