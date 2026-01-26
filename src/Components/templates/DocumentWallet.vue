<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
        <FileText class="w-5 h-5 text-indigo-600" /> {{ props.title }}
      </h2>
      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Compliance Records</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DocumentCard
        v-for="doc in walletDocuments"
        :key="doc.key"
        :doc="doc"
        @view="$emit('view', $event)"
        @upload="$emit('upload', $event)"
        @view-application="$emit('view-application')"
      />
    </div>

    <!-- Application Documents Section -->
    <div v-if="applicationDocs.length > 0" class="mt-10 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Application Disclosures & Signatures</h3>
        <span class="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Electronic Consents</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="doc in applicationDocs" :key="doc.label" class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 italic font-serif">
              {{ doc.signature ? 'S' : '?' }}
            </div>
            <div class="min-w-0">
               <h4 class="text-[11px] font-black text-slate-900 uppercase truncate" :title="doc.label">{{ doc.label }}</h4>
               <p class="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{{ doc.signature || 'Not Signed' }}</p>
            </div>
          </div>
          <button @click="$emit('view-signature', doc)" class="w-full py-1.5 text-[9px] font-black uppercase tracking-tighter bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-pointer border border-slate-100 font-black">
            Verify Digital Signature
          </button>
        </div>
      </div>
    </div>

    <!-- Upload History / Document Logs -->
    <DocumentHistoryRegistry
      :logs="filteredLogs"
      @view-log="$emit('view-log', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText,  Truck, FileCheck, ShieldAlert, GraduationCap, FileSignature } from 'lucide-vue-next'
import type { DocumentLog } from '@/types'
import dayjs from 'dayjs'
import DocumentCard from '@/Components/ui/cards/DocumentCard.vue'
import DocumentHistoryRegistry from '@/Components/ui/lists/DocumentHistoryRegistry.vue'

const props = defineProps<{
  driver: any
  logs: DocumentLog[]
  title: string
}>()

defineEmits(['view', 'upload', 'view-log', 'view-application', 'view-signature'])

const filteredLogs = computed(() => {
  const checklistTypes = ['license', 'medical', 'mvr', 'drugAlcohol', 'roadTest', 'application']
  return props.logs.filter(log => checklistTypes.includes(log.type))
})

const walletDocuments = computed(() => {
  const d = props.driver
  
  // Helper to extract file URL regardless of structure (Driver object vs Applicant string)
  const getFile = (field: any) => {
     if (!field) return null
     if (typeof field === 'string') return field
     return field.file
  }
  
  // Helper to extract expiry regardless of structure
  const getExpiry = (field: any, fallback?: string) => {
     if (field && typeof field === 'object' && field.expiryDate) return field.expiryDate
     return fallback
  }

  const docs = [
    { key: 'license', label: 'Drivers License', cfr: 'FMCSA 49 CFR Part 391.21', file: getFile(d.license) || d.licenseFront, expiryDate: getExpiry(d.license, d.personalInfo?.licenseExpirationDate) },
    { key: 'medical', label: 'Medical Card', cfr: 'FMCSA 49 CFR Part 391.43', file: getFile(d.medical) || d.medicalCard, expiryDate: getExpiry(d.medical, d.personalInfo?.medicalExpirationDate) },
    { key: 'mvr', label: 'MVR Report', cfr: 'FMCSA 49 CFR Part 391.25', file: getFile(d.mvr), expiryDate: getExpiry(d.mvr) },
    { key: 'drugAlcohol', label: 'Clearinghouse', cfr: 'FMCSA 49 CFR Part 382.701', file: getFile(d.drugAlcohol), expiryDate: getExpiry(d.drugAlcohol) },
    { key: 'roadTest', label: 'Road Test', cfr: 'FMCSA 49 CFR Part 391.31', file: getFile(d.roadTest), expiryDate: getExpiry(d.roadTest) },
    { key: 'application', label: 'Signed Application', cfr: 'FMCSA 49 CFR Part 391.21', file: d.applicationFile || (d.appliedDate || d.createdAt ? 'APP_EXISTS' : null) }
  ]
  return docs
})

const applicationDocs = computed(() => {
  const d = props.driver
  if (!d.drugTestSignature && !d.fmcsaConsentSignature) return []

  return [
    { label: 'Drug & Alcohol Policy', signature: d.alcoholDrugPolicySignature, date: d.alcoholDrugPolicyDate },
    { label: 'Drug Test Consent', signature: d.drugTestSignature, date: d.drugTestDate },
    { label: 'PSP Disclosure', signature: d.pspDisclosureSignature, date: d.pspDisclosureDate },
    { label: 'Clearinghouse Consent', signature: d.fmcsaConsentSignature, date: d.fmcsaConsentDate },
    { label: 'Auth & Release', signature: d.authReleaseSignature, date: d.authReleaseDate },
    { label: 'FCRA Authorization', signature: d.fairCreditReportingSignature, date: d.fairCreditReportingDate },
    { label: 'General Work Policy', signature: d.generalWorkPolicySignature, date: d.generalWorkPolicyDate }
  ].filter(i => i.signature)
})

function getDocIcon(key: string) {
  switch (key) {
    case 'license': return FileCheck
    case 'medical': return ShieldAlert
    case 'mvr': return GraduationCap
    case 'drugAlcohol': return FileSignature
    case 'roadTest': return Truck
    default: return FileText
  }
}

function getStatusTextColor(date?: string) {
  if (!date) return 'text-slate-400'
  const today = dayjs().startOf('day')
  const exp = dayjs(date)
  const diff = exp.diff(today, 'day')

  if (diff < 0) return 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded'
  if (diff <= 30) return 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded'
  return 'text-green-600 bg-green-50 px-1.5 py-0.5 rounded'
}

</script>
