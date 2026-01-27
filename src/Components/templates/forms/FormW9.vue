<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
      {{ error }}
    </div>

    <!-- PDF Viewer -->
    <div v-else class="space-y-4">
      <!-- Header with Download Button -->
      <div
        class="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200"
      >
        <div>
          <h3 class="text-lg font-semibold text-slate-900">Form W-9</h3>
          <p class="text-sm text-slate-600">
            Request for Taxpayer Identification Number and Certification
          </p>
        </div>
        <BaseButton
          label="Download W-9"
          :icon="Download"
          variant="blue"
          @click="handleDownload"
          class="px-4 py-2"
        />
      </div>

      <!-- PDF Display -->
      <div class="border-2 border-slate-300 rounded-lg overflow-hidden bg-white">
        <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-[800px]" title="W-9 Form" />
      </div>

      <!-- Info Note -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800">
          <strong>Note:</strong> This W-9 form has been automatically filled with the driver's
          information. Review the document and download it if needed. The form is read-only and
          cannot be edited here.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Download } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import { useW9PdfFiller } from '@/Composables/useW9PdfFiller'
import type { Driver } from '@/types'

const props = defineProps<{
  data: Driver
}>()

const { fillW9Pdf, downloadPdf, createPdfUrl } = useW9PdfFiller()

const loading = ref(true)
const error = ref<string | null>(null)
const pdfUrl = ref<string | null>(null)
const pdfBlob = ref<Blob | null>(null)

async function generatePdf() {
  loading.value = true
  error.value = null

  try {
    // Generate filled PDF
    const blob = await fillW9Pdf(props.data)
    pdfBlob.value = blob

    // Create URL for display
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }
    pdfUrl.value = createPdfUrl(blob)
  } catch (err) {
    console.error('Failed to generate W-9 PDF:', err)
    error.value = 'Failed to generate W-9 form. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleDownload() {
  if (pdfBlob.value) {
    const filename = `W9_${props.data.firstName}_${props.data.lastName}.pdf`
    downloadPdf(pdfBlob.value, filename)
  }
}

// Generate PDF on mount
onMounted(() => {
  generatePdf()
})

// Regenerate if driver data changes
watch(
  () => props.data,
  () => {
    generatePdf()
  },
  { deep: true },
)

// Cleanup on unmount
onBeforeUnmount(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
})
</script>

<script lang="ts">
import { onBeforeUnmount } from 'vue'
export default {
  name: 'FormW9',
}
</script>
