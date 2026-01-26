<template>
  <BaseModal :isOpen="isOpen" :title="title" size="max-w-4xl" @close="$emit('close')">
    <div class="space-y-6">
      <!-- Content Area -->
      <div class="min-h-[200px]">
        <!-- Flag Driver Mode -->
        <div v-if="mode === 'flag_driver'" class="space-y-4">
          <p class="text-slate-600">You are about to flag this driver, provide the description of flag.</p>
          <textarea
            v-model="form.reason"
            class="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-sm"
            placeholder="Enter reason..."
          ></textarea>
        </div>

        <!-- Request Upload Mode (License/Medical/FCRA) -->
        <div v-if="mode.startsWith('request_')" class="space-y-6">
          <p class="text-slate-600">Please enter the email address(es) to receive the manual {{ requestTypeLabel }} upload link.</p>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <label class="text-sm font-medium text-slate-700">Send To Email Address(es)</label>
              <div class="md:col-span-2">
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-800"
                />
                <span class="text-[10px] text-slate-400 mt-1 block">Separate multiples with a comma.</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <label class="text-sm font-medium text-slate-700">Link To Send</label>
              <div class="md:col-span-2">
                <input
                  :value="magicLink"
                  readonly
                  class="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div class="space-y-2">
               <label class="text-sm font-medium text-slate-700">Custom Email Message (Optional)</label>
               <textarea
                 v-model="form.customMessage"
                 rows="3"
                 class="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-sm"
                 placeholder="Enter a custom note to appear in the email body..."
               ></textarea>
            </div>
          </div>
        </div>

        <!-- Memo List / Policy Mode -->
        <div v-if="mode === 'send_memo' || mode === 'send_policy'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- List Side -->
          <div class="md:col-span-2 space-y-4">
            <h4 class="font-bold text-slate-800">{{ mode === 'send_memo' ? 'Memo List' : 'Safety Policies' }}</h4>
            <p class="text-xs text-slate-500">Select one or more items below that you would like to send to your driver(s).</p>

            <div class="border border-slate-200 rounded-lg overflow-hidden">
              <div v-if="isLoadingMemos" class="p-8 text-center text-slate-400 text-xs">Loading items...</div>
              <table v-else class="w-full text-sm">
                <thead class="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th class="p-3 text-left w-10">
                      <input type="checkbox" @change="toggleAllMemos" :checked="allSelected" />
                    </th>
                    <th class="p-3 text-left text-xs font-semibold text-slate-500 uppercase">{{ mode === 'send_memo' ? 'Memo File' : 'Policy File' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="file in filteredMemos" :key="file.id" class="hover:bg-slate-50 transition-colors">
                    <td class="p-3">
                      <input type="checkbox" v-model="form.selectedFiles" :value="file.fileUrl" />
                    </td>
                    <td class="p-3">
                      <div class="flex items-center justify-between">
                         <span class="text-slate-700">{{ file.title }}</span>
                         <button
                           @click.stop="handleDeleteMemo(file.id)"
                           class="text-slate-400 cursor-pointer hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                           title="Delete File"
                         >
                           <Trash2 class="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredMemos.length === 0">
                    <td colspan="2" class="p-8 text-center text-slate-400 text-xs italic">No entries found. Upload one to start.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Upload Side -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit space-y-4">
            <h4 class="font-bold text-slate-800">Upload New</h4>
            <div
              @click="fileInput?.click()"
              class="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center space-y-2 hover:border-slate-300 transition-all cursor-pointer relative"
              :class="{ 'opacity-50 cursor-wait': isUploadingMemo }"
            >
              <input type="file" ref="fileInput" class="hidden" @change="handleMemoUpload" />
              <Upload class="w-8 h-8 text-slate-300 mx-auto" />
              <div class="text-[11px] text-slate-500">{{ isUploadingMemo ? 'Uploading...' : 'Select file(s)...' }}</div>
            </div>
            <div v-if="uploadStatus" class="text-[10px] text-center" :class="uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'">
              {{ uploadStatus.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-all text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          v-if="mode === 'send_memo' || mode === 'send_policy'"
          @click="sendSelected"
          :disabled="isSendingMemos || form.selectedFiles.length === 0"
          class="px-6 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 text-sm cursor-pointer"
        >
          {{ isSendingMemos ? 'Sending...' : 'Send Selected Items' }}
        </button>
        <button
          v-else
          @click="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 text-sm cursor-pointer"
        >
          {{ isSubmitting ? 'Processing...' : submitLabel }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Upload, Trash2 } from 'lucide-vue-next'
import { dataService } from '@/services/dataService'
import type { Driver } from '@/types'
import BaseModal from '@/Components/ui/BaseModal.vue'

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    required: true,
    // flag_driver, request_license, request_medical, send_memo, send_policy
  },
  driver: {
    type: Object as () => Driver | null,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  reason: '',
  email: props.driver?.email || '',
  selectedFiles: [] as string[],
  customMessage: ''
})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const memos = ref<any[]>([])
const isLoadingMemos = ref(false)
const isUploadingMemo = ref(false)
const isSendingMemos = ref(false)
const isSubmitting = ref(false)
const isDeletingMemo = ref<string | null>(null)
const uploadStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const fetchMemos = async () => {
  isLoadingMemos.value = true
  memos.value = await dataService.getMemos()
  isLoadingMemos.value = false
}

const filteredMemos = computed(() => {
  const type = props.mode === 'send_memo' ? 'memo' : 'policy'
  return memos.value.filter(m => m.type === type)
})

const allSelected = computed(() => {
  return filteredMemos.value.length > 0 && form.value.selectedFiles.length === filteredMemos.value.length
})

function toggleAllMemos() {
  if (allSelected.value) {
    form.value.selectedFiles = []
  } else {
    form.value.selectedFiles = filteredMemos.value.map(m => m.fileUrl)
  }
}

async function handleMemoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    isUploadingMemo.value = true
    uploadStatus.value = null
    try {
      const type = props.mode === 'send_memo' ? 'memo' : 'policy'
      await dataService.uploadMemo(file, file.name, type)
      await fetchMemos()
      uploadStatus.value = { type: 'success', message: 'File uploaded!' }
    } catch {
      uploadStatus.value = { type: 'error', message: 'Upload failed' }
    } finally {
      isUploadingMemo.value = false
    }
  }
}

async function handleDeleteMemo(id: string) {
  if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return

  isDeletingMemo.value = id
  try {
    await dataService.deleteMemo(id)
    await fetchMemos()
    // Remove from selection if it was selected
    form.value.selectedFiles = form.value.selectedFiles.filter(() => {
       // Since we refreshed memos, the deleted one is gone.
       // We just reset selection for safety as we don't track which ID matches which URL easily here without extra logic.
       return true
    })
    // Better logic:
    form.value.selectedFiles = [] // Simplest safety measure
  } catch {
    alert('Failed to delete file')
  } finally {
    isDeletingMemo.value = null
  }
}


async function sendSelected() {
  if (!props.driver || form.value.selectedFiles.length === 0) return
  isSendingMemos.value = true
  try {
    const typeLabel = props.mode === 'send_memo' ? 'Memos' : 'Safety Policies'
    await dataService.sendMemos({
      email: form.value.email,
      driverName: `${props.driver.firstName} ${props.driver.lastName}`,
      memoTitle: typeLabel,
      memoLinks: form.value.selectedFiles
    })
    alert(`${typeLabel} sent successfully to ${form.value.email}`)
    emit('close')
  } catch {
    alert('Failed to send emails')
  } finally {
    isSendingMemos.value = false
  }
}

onMounted(fetchMemos)

const title = computed(() => {
  switch (props.mode) {
    case 'flag_driver': return 'Flag Driver'
    case 'request_license': return 'Send Driver\'s License Upload Request'
    case 'request_medical': return 'Send Medical Card Upload Request'
    case 'send_memo': return 'Memo Center'
    case 'send_policy': return 'Safety Policy Center'
    default: return 'Action'
  }
})

const requestTypeLabel = computed(() => {
  if (props.mode === 'request_license') return 'driver\'s license'
  if (props.mode === 'request_medical') return 'medical card'
  return ''
})

const docTypeKey = computed(() => {
  if (props.mode === 'request_license') return 'license'
  if (props.mode === 'request_medical') return 'medical'
  return ''
})

const submitLabel = computed(() => {
  if (props.mode === 'flag_driver') return 'Flag Driver'
  return 'Send'
})

const magicLink = computed(() => {
  if (!props.driver?.id) return 'Generating link...'
  const baseUrl = window.location.origin
  let typeId = '5' // license
  if (props.mode === 'request_medical') typeId = '6'
  return `${baseUrl}/driver/upload/?did=${props.driver.id}&cid=${typeId}`
})

watch(() => props.isOpen, (val) => {
  if (val && props.driver) {
    form.value.email = props.driver.email
    form.value.reason = ''
    form.value.customMessage = ''
  }
})

async function submit() {
  if (!props.driver) return
  isSubmitting.value = true
  try {
    if (props.mode.startsWith('request_')) {
      await dataService.sendUploadRequest({
        email: form.value.email,
        driverName: `${props.driver.firstName} ${props.driver.lastName}`,
        requestType: requestTypeLabel.value,
        magicLink: magicLink.value,
        customMessage: form.value.customMessage,
        driverId: props.driver.id,
        docType: docTypeKey.value
      })
      alert(`Upload request sent to ${form.value.email}`)
    } else if (props.mode === 'flag_driver') {
      emit('success', { mode: props.mode, data: { ...form.value } })
    }
    emit('close')
  } catch {
    alert('Failed to process request')
  } finally {
    isSubmitting.value = false
  }
}
</script>
