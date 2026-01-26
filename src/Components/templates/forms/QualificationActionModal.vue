<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
      @click="$emit('close')"
    ></div>

    <div
      class="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/20"
    >
      <!-- Header -->
      <div
        class="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span
              class="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
              >Qualification</span
            >
            <span class="text-slate-400 text-xs font-bold uppercase tracking-widest">{{
              item.cfr
            }}</span>
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            {{ item.label }} Qualification
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="w-10 cursor-pointer h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Action Stepper (if needed) -->
      <div class="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-4 shrink-0">
        <div :class="['flex items-center gap-2', step === 'selection' ? 'opacity-100' : 'opacity-40']">
          <div
            :class="['w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-colors', step === 'selection' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400']"
          >
            1
          </div>
          <span :class="['text-xs font-bold uppercase tracking-wide transition-colors', step === 'selection' ? 'text-slate-900' : 'text-slate-600']"
            >Review & Selection</span
          >
        </div>
        <div class="h-px w-8 bg-slate-200"></div>
        <div :class="['flex items-center gap-2', step !== 'selection' ? 'opacity-100' : 'opacity-40']">
          <div
            :class="['w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-colors', step !== 'selection' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400']"
          >
            2
          </div>
          <span :class="['text-xs font-bold uppercase tracking-wide transition-colors', step !== 'selection' ? 'text-slate-900' : 'text-slate-600']"
            >Data Entry / Upload</span
          >
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-8 space-y-8">
        <!-- Step 1: Selection (Image 0 style) -->
        <div
          v-if="step === 'selection'"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div
              v-if="isAlreadyCompleted"
              class="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <div
                class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0 shadow-sm border border-green-200"
              >
                <CheckCircle2 class="w-6 h-6" />
              </div>
              <div>
                <h5 class="text-sm font-black text-green-900 uppercase tracking-widest mb-1">
                  Status: Successfully Completed
                </h5>
                <p class="text-xs text-green-700 font-medium">
                  This qualification was finalized on {{ formatDate(completionDate) }}. You can
                  review the details below.
                </p>
              </div>
            </div>

            <!-- Drug & Alcohol Specialized Text -->
            <p
              v-if="item.key === 'drugAlcoholClearinghouse'"
              class="text-slate-600 text-sm leading-relaxed"
            >
              This qualification requires that you keep a signed driver consent form and perform a
              pre-employment and annual query with the FMCSA Drug & Alcohol Clearinghouse.
            </p>
            <p v-else-if="item.key === 'roadTest'" class="text-slate-600 text-sm leading-relaxed">
              This qualification requires <strong>either</strong> a copy of the drivers license be
              valid and on file, or a road test be administered and results entered into the
              program.
            </p>
            <p v-else class="text-slate-600 text-sm leading-relaxed">
              This qualification requires the completed and signed
              <strong>{{ item.label }}</strong> form AND potential supporting documentation to be
              ran/uploaded for each license the driver has held in the last 3 years. The program can
              handle both of these tasks for you.
            </p>

            <!-- Exempt Toggle (Image reference) -->
            <div
              v-if="item.key === 'drugAlcoholClearinghouse'"
              class="flex items-center gap-3 bg-sky-50 border border-sky-100 p-4 rounded-xl"
            >
              <input
                type="checkbox"
                v-model="isExempt"
                id="exempt-toggle"
                class="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-sky-300"
              />
              <label
                for="exempt-toggle"
                class="text-[10px] font-black text-sky-700 uppercase tracking-widest cursor-pointer"
              >
                NOT REQUIRED: This driver is exempt from the Drug & Alcohol Clearinghouse
                qualification.
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-sm font-black text-slate-400 uppercase tracking-widest px-1">
              Specific Requirements
            </h4>

            <!-- Specialized Drug & Alcohol Sub-items (Image reference) -->
            <div
              v-if="item.key === 'drugAlcoholClearinghouse'"
              class="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden"
            >
              <!-- Item 1: Signed Limited Query Consent -->
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0 border border-green-100"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">
                      Signed Limited Query Consent
                    </h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      You must keep a signed consent form by the driver for a limited query.
                    </p>
                  </div>
                </div>
                <div class="pl-14">
                  <BaseButton
                    label="View Signed Consent Form"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                  />
                </div>
              </div>

              <!-- Item 2: Pre-Employment Query -->
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 border border-slate-100"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">Pre-Employment Query</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      You must run a full query as part of the pre-employment qualification.
                    </p>
                  </div>
                </div>
                <div class="pl-14 flex gap-3">
                  <BaseButton
                    label="Submit Pre-Employment Query"
                    variant="primary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                  />
                  <BaseButton
                    label="Mark Completed"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="handleComplete"
                  />
                </div>
              </div>

              <!-- Item 3: Annual Query -->
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 border border-slate-100"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">Annual Query</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      You must run a limited query on an annual basis for each employed driver.
                    </p>
                  </div>
                </div>
                <div class="pl-14 flex gap-3">
                  <BaseButton
                    label="Submit Annual Query"
                    variant="primary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                  />
                  <BaseButton
                    label="Mark Completed"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="handleComplete"
                  />
                </div>
              </div>
            </div>

            <!-- Specialized Road Test Sub-items (Image reference) -->
            <div
              v-else-if="item.key === 'roadTest'"
              class="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden"
            >
              <!-- Item 1: Copy of Drivers License -->
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
                      driver.license?.file
                        ? 'bg-green-50 text-green-500 border-green-100'
                        : 'bg-slate-50 text-slate-300 border-slate-100',
                    ]"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">Copy of Drivers License</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      If using this option, a copy of the drivers license must be valid and on file.
                      Please select the appropriate option below.
                    </p>
                  </div>
                </div>
                <div class="pl-14">
                  <BaseButton
                    label="Upload Copy of Drivers License"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="step = 'upload'"
                  />
                </div>
              </div>

              <!-- Item 2: Road Test -->
              <div class="p-6 space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
                      driver.roadTest?.file
                        ? 'bg-green-50 text-green-500 border-green-100'
                        : 'bg-slate-50 text-slate-300 border-slate-100',
                    ]"
                  >
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">Road Test</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      If using this option, a road test must be administered and the results entered
                      into the program. Please select the appropriate option below.
                    </p>
                  </div>
                </div>
                <div class="pl-14 flex gap-3">
                  <BaseButton
                    label="Complete Road Test"
                    variant="primary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="step = 'form'"
                  />
                  <BaseButton
                    label="Upload Road Test"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="step = 'upload'"
                  />
                </div>
              </div>
            </div>

            <!-- Specialized Driving Record Inquiry (MVR) -->
            <div
              v-else-if="item.key === 'drivingRecordInquiry'"
              class="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden"
            >
              <div class="p-6 space-y-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"
                  >
                    <FileCheck class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">MVR Inquiry Request</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      You must run an inquiry into the driving record (MVR) for the preceding 3
                      years. You can complete the request form here or upload the official report
                      received.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3 pl-14">
                  <BaseButton
                    label="Complete Request Now"
                    variant="primary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter shadow-indigo-200/50 shadow-lg"
                    @click="step = 'form'"
                  />
                  <BaseButton
                    label="Upload Official MVR Report"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="step = 'upload'"
                  />
                </div>
              </div>
            </div>

            <!-- Default Generic Sub-menu -->
            <div
              v-else
              class="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden"
            >
              <div class="p-6 space-y-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"
                  >
                    <FileCheck class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">{{ item.label }} Form</h5>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      You must complete and sign the {{ item.label }} form pertaining to this
                      license. Please select the appropriate option below.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3 pl-14">
                  <BaseButton
                    label="Complete Form Now"
                    variant="primary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter shadow-indigo-200/50 shadow-lg"
                    @click="step = 'form'"
                  />
                  <BaseButton
                    label="Upload Completed Form"
                    variant="secondary"
                    class="px-5 py-2 text-xs font-black rounded-xl uppercase tracking-tighter"
                    @click="step = 'upload'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Form (Image 1 style) -->
        <div v-if="step === 'form'" class="animate-in fade-in zoom-in-95 duration-500">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div class="p-10 space-y-12">
              <!-- Form Header -->
              <div class="text-center space-y-2 border-b border-slate-100 pb-8">
                <h2 class="text-sm font-black text-slate-400 tracking-[0.2em] uppercase">
                  Department of Transportation
                </h2>
                <h1 class="text-xl font-black text-slate-900 uppercase">{{ item.label }}</h1>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Motor Carrier Safety Program
                </p>
              </div>

              <!-- Form Inputs -->
              <div class="grid grid-cols-2 gap-x-12 gap-y-8">
                <div class="space-y-1.5 border-b-2 border-slate-100 pb-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >Driver Name</label
                  >
                  <p class="text-sm font-bold text-slate-900">{{ driverName }}</p>
                </div>
                <div class="space-y-1.5 border-b-2 border-slate-100 pb-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >DOB</label
                  >
                  <p class="text-sm font-bold text-slate-900">{{ driver.dob || 'N/A' }}</p>
                </div>
                <div class="space-y-1.5 border-b-2 border-slate-100 pb-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >License Number</label
                  >
                  <p class="text-sm font-bold text-slate-900 font-mono">
                    {{ driver.license?.documentNumber || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-1.5 border-b-2 border-slate-100 pb-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >SSN</label
                  >
                  <p class="text-sm font-bold text-slate-900 font-mono">
                    {{ driver.ssnNumber || 'N/A' }}
                  </p>
                </div>
              </div>

              <!-- Form Content (Generic for now) -->
              <div
                class="bg-slate-50 p-6 rounded-xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed"
              >
                The above listed individual has made application with us for employment as a driver.
                In accordance with Section 391.23(a)(1) and (b) of the Federal Motor Carrier Safety
                Regulations, we are required to make an Inquiry into the driving record during the
                preceding 3 years...
              </div>

              <!-- Signatures -->
              <div class="grid grid-cols-2 gap-12 pt-8">
                <div class="space-y-3">
                  <div
                    class="h-12 border-b-2 border-slate-900 flex items-center justify-center bg-slate-50 rounded-t-lg"
                  >
                    <!-- Simulated signature -->
                    {{ driver.firstName }} {{ driver.lastName }}
                  </div>
                  <div
                    class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    <span>Signature of Person making inquiry</span>
                    <span>Date: {{ dayjs().format('MM/DD/YYYY') }}</span>
                  </div>
                </div>
                <div class="space-y-3">
                  <div
                    class="h-12 border-b-2 border-slate-900 flex items-center justify-center bg-slate-50 rounded-t-lg"
                  >
                    <!-- Simulated signature for Operations Manager -->
                    {{ user.name }}
                  </div>
                  <div
                    class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    <span>Operations Manager</span>
                    <span>Title</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Footer -->
            <div
              class="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between"
            >
              <button
                @click="step = 'selection'"
                class="text-slate-400 cursor-pointer hover:text-slate-600 font-black text-xs uppercase tracking-widest px-4 py-2"
              >
                Back to Selection
              </button>
              <BaseButton
                label="Save & Complete"
                variant="primary"
                class="px-8 font-black uppercase tracking-widest shadow-xl shadow-indigo-200"
                @click="handleComplete"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Upload (Image 2 style) -->
        <div v-if="step === 'upload'" class="animate-in fade-in slide-in-from-right-4 duration-500">
          <div
            class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4"
          >
            <div
              class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-200"
            >
              <AlertCircle class="w-6 h-6" />
            </div>
            <div>
              <h5 class="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">
                Warning: Permanent Action
              </h5>
              <p class="text-xs text-amber-700 leading-relaxed font-medium">
                You cannot edit, change or delete a file after it has been added to a driver record.
                Please triple check all information for accuracy before uploading.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100"
          >
            <div class="p-8 space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >File Description</label
                >
                <input
                  type="text"
                  v-model="uploadDesc"
                  class="w-full bg-slate-50 border-slate-200 rounded-xl text-sm font-bold focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                    >File Date</label
                  >
                  <input
                    type="date"
                    v-model="uploadDate"
                    class="w-full bg-slate-50 border-slate-200 rounded-xl text-sm font-bold focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                    >Reference License</label
                  >
                  <div
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-900"
                  >
                    {{ driver.license?.documentNumber || 'N/A' }} ({{
                      driver.license?.state || 'N/A'
                    }})
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Upload File</label
                >
                <div class="relative group">
                  <input
                    type="file"
                    @change="handleFileChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    :class="[
                      'border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300',
                      selectedFile
                        ? 'bg-green-50 border-green-300 text-green-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:bg-slate-100',
                    ]"
                  >
                    <div v-if="!selectedFile" class="flex flex-col items-center">
                      <Upload
                        class="w-10 h-10 mb-4 opacity-50 transition-transform group-hover:-translate-y-1"
                      />
                      <p class="text-xs font-black uppercase tracking-widest">
                        Click or drag a file to upload
                      </p>
                      <p class="text-[10px] mt-2 opacity-60">PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <div v-else class="flex items-center gap-3">
                      <FileCheck class="w-8 h-8" />
                      <div class="text-left font-black">
                        <p class="text-sm text-slate-900 truncate max-w-[200px]">
                          {{ selectedFile.name }}
                        </p>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest">
                          Ready to upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 p-6 flex items-center justify-between">
              <button
                @click="step = 'selection'"
                class="text-slate-400 cursor-pointer hover:text-slate-600 font-black text-xs uppercase tracking-widest px-4 py-2"
              >
                Back to Selection
              </button>
              <BaseButton
                :disabled="!selectedFile"
                label="Upload & Complete"
                variant="primary"
                class="px-8 font-black uppercase tracking-widest shadow-xl shadow-indigo-200"
                @click="handleComplete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  X,
  FileCheck,
  Upload,
  AlertCircle,
  Plus,
  CheckCircle2,
  ChevronRight,
} from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import dayjs from 'dayjs'
import type { Driver, User } from '@/types'

const props = defineProps<{
  isOpen: boolean
  item: { key: string; label: string; cfr: string }
  driver: Driver
  user: User
}>()

const emit = defineEmits(['close', 'complete'])

const step = ref<'selection' | 'form' | 'upload'>('selection')
const uploadDesc = ref(props.item.label + ' manually uploaded.')
const uploadDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedFile = ref<File | null>(null)
const isExempt = ref(false)

const driverName = computed(() => {
  return `${props.driver.firstName} ${props.driver.lastName}`
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const isAlreadyCompleted = computed(() => {
  if (!props.driver.qualificationChecklist) return false
  return (props.driver.qualificationChecklist as any)[props.item.key] === true
})

const completionDate = computed(() => {
  if (!props.driver.qualificationChecklist?.completedAt) return ''
  return props.driver.qualificationChecklist.completedAt[props.item.key] || ''
})

function formatDate(date: string) {
  if (!date) return ''
  return dayjs(date).format('ddd, MMM DD, YYYY')
}

function handleComplete() {
  emit('complete', {
    key: props.item.key,
    value: true,
    file: selectedFile.value,
    notes: uploadDesc.value,
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');

.font-signature {
  font-family: 'Mrs+Saint+Delafield', cursive;
}
</style>
