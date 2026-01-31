<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div
      class="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center space-y-4">
        <div
          class="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin mx-auto"
        ></div>
        <p class="text-xs font-black uppercase tracking-widest text-slate-400">Verifying Link...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center space-y-6">
        <div
          class="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100"
        >
          <XCircle class="w-8 h-8" />
        </div>
        <div>
          <h3 class="text-lg font-black text-slate-900 mb-2">Invalid or Expired Link</h3>
          <p class="text-sm text-slate-500 leading-relaxed max-w-[250px] mx-auto">{{ error }}</p>
        </div>
        <div class="pt-4 border-t border-slate-100 w-full">
          <p class="text-[10px] text-slate-400 font-medium">
            Please contact your dispatcher for a new link.
          </p>
        </div>
      </div>

      <!-- Upload Form -->
      <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-8 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200"
            >
              <UploadCloud class="w-5 h-5" />
            </div>
            <div>
              <h1 class="text-lg font-black text-slate-900 uppercase tracking-tight">
                Document Upload
              </h1>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CharterSafe Secure Portal
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-slate-200/60">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >Driver</span
              >
              <span class="text-sm font-bold text-slate-800">{{ driverName }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-200/60">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >Document Type</span
              >
              <span
                class="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-transform capitalize"
                >{{ documentType }}</span
              >
            </div>
          </div>
        </div>

        <div class="p-8 space-y-6">
          <div class="space-y-4">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide"
              >Select File to Upload</label
            >

            <div class="relative group">
              <input
                type="file"
                @change="handleFileChange"
                accept=".pdf,.jpg,.jpeg,.png"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                :disabled="isUploading"
              />
              <div
                :class="[
                  'border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300',
                  selectedFile
                    ? 'bg-green-50 border-green-300 text-green-600'
                    : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:bg-slate-50',
                ]"
              >
                <div v-if="!selectedFile" class="flex flex-col items-center">
                  <Upload
                    class="w-8 h-8 mb-4 opacity-50 transition-transform group-hover:-translate-y-1"
                  />
                  <p class="text-xs font-black uppercase tracking-widest">Tap to select file</p>
                  <p class="text-[10px] mt-2 opacity-60">PDF, JPG, PNG</p>
                </div>
                <div v-else class="flex flex-col items-center gap-2">
                  <FileCheck class="w-8 h-8 mb-2" />
                  <p class="text-sm font-black text-slate-900 text-center max-w-[200px] truncate">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-[10px] text-green-600 uppercase tracking-widest font-bold">
                    Ready to upload
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="upload"
            :disabled="!selectedFile || isUploading"
            class="w-full py-4 cursor-pointer bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span v-if="isUploading">Uploading...</span>
            <span v-else>Submit Document</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { UploadCloud, Upload, FileCheck, XCircle } from 'lucide-vue-next'
import { dataService } from '@/services/dataService'
import { useDocumentsStore } from '@/stores/documentsStore'

const route = useRoute()
const isLoading = ref(true)
const error = ref('')
const driverName = ref('')
const documentType = ref('')
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const token = route.query.token as string
const documentStore = useDocumentsStore()

onMounted(async () => {
  if (!token) {
    error.value = 'Missing access token.'
    isLoading.value = false
    return
  }

  try {
    const data = await dataService.validateUploadToken(token)
    driverName.value = data.driverName
    documentType.value = data.documentType
  } catch (err: unknown) {
    const message = (err as Record<string, Record<string, Record<string, string>>>)?.response?.data
      ?.message
    error.value =
      (typeof message === 'string' ? message : null) || 'This link is invalid or has expired.'
  } finally {
    isLoading.value = false
  }
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

async function upload() {
  if (!selectedFile.value || !token) return
  isUploading.value = true

  // We need to implement public upload endpoint in dataService first.
  // But assume we have `dataService.publicUpload(token, file)`
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('token', token)

    // Direct axios call or new dataService method.
    // Since dataService uses apiClient which might have interceptors (auth),
    // we need to verify if apiClient adds token headers that might fail?
    // apiClient adds `Authorization: Bearer undefined` if not logged in?
    // Usually axios interceptors handle that gracefully or we use a separate instance.
    // For now, let's assume apiClient is safe or we use fetch.

    // I'll add `uploadWithToken` to dataService.
    await documentStore.uploadPublicDocument(token, selectedFile.value)

    alert('Upload Successful!')
    window.close() // Try to close or redirect
  } catch {
    alert('Upload failed. Please try again.')
  } finally {
    isUploading.value = false
  }
}
</script>
