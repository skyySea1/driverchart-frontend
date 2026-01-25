<template>
  <BaseModal
    :isOpen="isOpen"
    :title="`Upload ${documentLabel}`"
    size="w-full md:w-3/4 lg:w-2/4 xl:w-1/4 rounded-lg"
    @close="$emit('close')"
  >
    <div class="space-y-4 p-1">
      <BaseAlert v-if="errorMsg" type="error" :message="errorMsg" @close="errorMsg = ''" />

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <!-- Info -->
        <div class="flex items-center gap-3 text-slate-600">
          <Info class="w-5 h-5 text-blue-500" />
          <p class="text-xs">
            Updating this document will automatically update the driver's compliance status and
            register an audit log.
          </p>
        </div>

        <!-- Expiry Date -->
        <InputGroup
          label="Expiration Date"
          type="date"
          v-model="form.expiryDate"
          required
          tooltip="Set the new expiration date for this document"
        />

        <!-- File Upload -->
        <FileInput
          label="Select Document File"
          v-model:fileName="fileName"
          @change="handleFileSelected"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <BaseButton
          :icon="X"
          label="Cancel"
          variant="secondary"
          @click="$emit('close')"
          :disabled="isUploading"
        />
        <BaseButton
          label="Upload & Update"
          variant="primary"
          :icon="Upload"
          :loading="isUploading"
          @click="handleUpload"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import BaseModal from '@/Components/ui/BaseModal.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import InputGroup from '@/Components/ui/InputGroup.vue'
import FileInput from '@/Components/ui/FileInput.vue'
import { Info, Upload, X } from 'lucide-vue-next'
import { dataService } from '@/services/dataService'

const props = defineProps<{
  isOpen: boolean
  driverId: string
  driverName: string
  documentType: string
  currentExpiry?: string
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const isUploading = ref(false)
const errorMsg = ref('')
const fileName = ref('')
const selectedFile = ref<File | null>(null)

const form = reactive({
  expiryDate: props.currentExpiry || '',
})

const documentLabel = computed(() => {
  const labels: Record<string, string> = {
    license: 'License',
    medical: 'Medical Certificate',
    mvr: 'MVR Report',
    drugAlcohol: 'Drug & Alcohol',
    roadTest: 'Road Test',
  }
  return labels[props.documentType] || props.documentType
})

function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    fileName.value = target.files[0].name
  }
}

async function handleUpload() {
  if (!selectedFile.value) {
    errorMsg.value = 'Please select a file to upload.'
    return
  }

  if (!form.expiryDate) {
    errorMsg.value = 'Please provide an expiration date.'
    return
  }

  isUploading.value = true
  errorMsg.value = ''

  try {
    await dataService.uploadDocument(
      props.driverId,
      props.documentType,
      selectedFile.value,
      new Date().toISOString(),
      props.driverName,
      form.expiryDate,
    )

    emit('success')
    emit('close')
  } catch (err) {
    console.error('Upload failed:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorMsg.value = (err as any).message
    } else {
      errorMsg.value = 'Failed to upload document. Please try again.'
    }
  } finally {
    isUploading.value = false
  }
}
</script>
