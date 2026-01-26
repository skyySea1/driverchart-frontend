<template>
  <div class="space-y-10">
    <!-- Driver Qualification File -->
    <section class="space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div class="w-1.5 h-6 bg-slate-900 rounded-full"></div>
          Driver Qualification File
        </h3>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Standard Requirements</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div class="divide-y divide-slate-100">
          <div v-for="item in qualificationItems" :key="item.key" class="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all duration-300">
            <div class="flex items-center gap-5">
              <!-- Status Icon -->
              <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500',
                isCompleted(item.key)
                  ? 'bg-green-50/50 border-green-500 text-green-600 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]'
                  : 'bg-slate-50 border-slate-200 text-slate-300'
              ]">
                <CheckCircle2 v-if="isCompleted(item.key)" class="w-7 h-7" />
                <Circle v-else class="w-7 h-7 stroke-[1.5px]" />
              </div>

              <div>
                <h4 class="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{{ item.label }}</h4>
                <p class="text-[11px] text-slate-400 font-black mt-1 tracking-wider uppercase flex items-center gap-2">
                  <span class="bg-slate-100 px-1.5 py-0.5 rounded leading-none">{{ item.cfr }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- View File Button -->
              <button
                v-if="hasUploadedFile(item.key)"
                @click="viewFile(item.key)"
                class="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-xs font-black hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 group/view"
                title="View uploaded file"
              >
                <Eye class="w-3.5 h-3.5 group-hover/view:scale-110 transition-transform" />
                View File
              </button>

              <div v-if="isCompleted(item.key)" class="text-right">
                <div class="flex items-center gap-1.5 justify-end mb-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p class="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Completed On</p>
                </div>
                <p class="text-sm font-black text-slate-900">{{ formatDate(getCompletionDate(item.key)) }}</p>
              </div>
              <button
                v-else
                @click="completeNow(item)"
                class="px-5 py-2.5 cursor-pointer bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn"
              >
                Complete Now
                <Plus class="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alcohol & Controlled Substances File -->
    <section class="space-y-5">
       <div class="flex items-center justify-between">
        <h3 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div class="w-1.5 h-6 bg-red-500 rounded-full"></div>
          Alcohol & Controlled Substances File
        </h3>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Compliance Regulations</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div class="divide-y divide-slate-100">
          <div v-for="item in alcoholItems" :key="item.key" class="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all duration-300">
            <div class="flex items-center gap-5">
               <!-- Status Icon -->
               <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500',
                isCompleted(item.key)
                  ? 'bg-green-50/50 border-green-500 text-green-600 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]'
                  : 'bg-slate-50 border-slate-200 text-slate-300'
              ]">
                <CheckCircle2 v-if="isCompleted(item.key)" class="w-7 h-7" />
                <Circle v-else class="w-7 h-7 stroke-[1.5px]" />
              </div>

              <div>
                <h4 class="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{{ item.label }}</h4>
                <p class="text-[11px] text-slate-400 font-black mt-1 tracking-wider uppercase flex items-center gap-2">
                  <span class="bg-slate-100 px-1.5 py-0.5 rounded leading-none">{{ item.cfr }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- View File Button -->
              <button
                v-if="hasUploadedFile(item.key)"
                @click="viewFile(item.key)"
                class="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-xs font-black hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 group/view"
                title="View uploaded file"
              >
                <Eye class="w-3.5 h-3.5 group-hover/view:scale-110 transition-transform" />
                View File
              </button>

              <div v-if="isCompleted(item.key)" class="text-right">
                <div class="flex items-center gap-1.5 justify-end mb-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p class="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Completed On</p>
                </div>
                <p class="text-sm font-black text-slate-900">{{ formatDate(getCompletionDate(item.key)) }}</p>
              </div>
              <button
                v-else
                @click="completeNow(item)"
                class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn"
              >
                Complete Now
                <Plus class="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Circle, ArrowRight, Plus, Eye } from 'lucide-vue-next'
import dayjs from 'dayjs'
import type { Driver } from '@/types'

const props = defineProps<{
  driver: Driver
}>()

const emit = defineEmits(['update-item', 'request-action', 'view-file'])

const qualificationItems = [
  { key: 'dotApplication', label: 'Proper "DOT" Application', cfr: 'FMCSA 49 CFR Part 391.21' },
  { key: 'drivingRecordInquiry', label: 'Inquiry Into Driving Record (Preceding 3 years)', cfr: 'FMCSA 49 CFR Part 391.23' },
  { key: 'goodFaithEffort', label: 'Good Faith Effort Document (When Required)', cfr: 'FMCSA 49 CFR Part 391.23' },
  { key: 'roadTest', label: 'Road Test or Copy of Drivers License in Lieu of Road Test', cfr: 'FMCSA 49 CFR Part 391.31 & 391.33' },
  { key: 'medicalCertificate', label: 'Copy of Medical Certificate (Long Form suggested)', cfr: 'FMCSA 49 CFR Part 391.41' },
  { key: 'medicalRegistryVerification', label: "Medical Examiner's National Registry Verification", cfr: 'FMCSA 49 CFR Part 391.23 & 391.51' },
  { key: 'annualDrivingReview', label: 'Annual Review of Driving Record (Preceding 12 months)', cfr: 'FMCSA 49 CFR Part 391.25' },
  { key: 'cdlisReport', label: "Commercial Driver's License Information System (CDLIS) Report", cfr: 'Standard Requirement' },
]

const alcoholItems = [
  { key: 'drugAlcoholClearinghouse', label: 'Drug & Alcohol Clearinghouse', cfr: 'Standard Requirement' },
  { key: 'preEmploymentDrugTest', label: 'Pre-Employment Drug Test', cfr: 'FMCSA 49 CFR Part 382.301' },
  { key: 'randomProgramPlacement', label: 'Placed in Random Program', cfr: 'FMCSA 49 CFR Part 382.305' },
  { key: 'companyTestingPolicyReceipt', label: 'Certificate of Receipt for Company Testing Policy', cfr: 'FMCSA 49 CFR Part 382.601' },
  { key: 'drugAlcoholStatement', label: 'Pre-Employment Employee Alcohol and Drug Test Statement', cfr: 'FMCSA 49 CFR Part 382.413' },
]

function isCompleted(key: string): boolean {
  if (!props.driver.qualificationChecklist) return false
  return (props.driver.qualificationChecklist as any)[key] === true
}

function getCompletionDate(key: string): string {
  if (!props.driver.qualificationChecklist?.completedAt) return ''
  return props.driver.qualificationChecklist.completedAt[key] || ''
}

function formatDate(date: string) {
  if (!date) return ''
  return dayjs(date).format('ddd, MMM DD, YYYY')
}

function completeNow(item: any) {
  emit('request-action', item)
}

function hasUploadedFile(key: string): boolean {
  // Map checklist keys to driver document fields
  const fileMap: Record<string, string> = {
    dotApplication: 'applicationFile',
    drivingRecordInquiry: 'mvr',
    roadTest: 'roadTest',
    medicalCertificate: 'medical',
    drugAlcoholClearinghouse: 'drugAlcohol',
    preEmploymentDrugTest: 'drugAlcohol',
  }
  
  const field = fileMap[key]
  if (!field) return false
  
  const value = (props.driver as any)[field]
  if (!value) return false
  
  // Handle both string URLs and object with file property
  if (typeof value === 'string') return value.length > 0
  if (typeof value === 'object' && value.file) return value.file.length > 0
  
  return false
}

function viewFile(key: string) {
  emit('view-file', key)
}

</script>
