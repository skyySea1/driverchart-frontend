<template>
  <BaseModal :isOpen="isOpen" :title="doc?.label || 'Signature Proof'" size="max-w-2xl" @close="$emit('close')">
    <div class="space-y-6">
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-8 relative overflow-hidden">
        <!-- Watermark -->
        <div class="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12 pointer-events-none">
          <FileSignature class="w-64 h-64 text-slate-900" />
        </div>

        <div class="text-center space-y-2 relative z-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-4">
            <CheckCircle2 class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Electronic Signature Verified</h2>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ doc?.label }}</p>
        </div>

        <div class="space-y-6 relative z-10">
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signer Name</span>
              <p class="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-1">{{ doc?.signature }}</p>
            </div>
            <div class="space-y-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Signed</span>
              <p class="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-1">{{ formatDate(doc?.date) }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification ID</span>
            <p class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100 flex items-center justify-between">
              {{ verificationId }}
              <span class="bg-indigo-600 text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-widest">Secured</span>
            </p>
          </div>
        </div>

        <div class="pt-8 flex flex-col items-center justify-center space-y-4">
          <div class="w-full h-px bg-slate-200"></div>
          <div class="text-center space-y-1">
            <p class="text-[10px] font-serif italic text-slate-400">Digitally signed and timestamped by the applicant.</p>
            <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Phoenix Bus DOT Compliance System</p>
          </div>
        </div>
      </div>

      <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck class="w-5 h-5 text-indigo-600 shrink-0" />
        <p class="text-[11px] text-indigo-800 leading-relaxed">
          This electronic signature has the same legal standing as a handwritten signature under the
          <strong>Electronic Signatures in Global and National Commerce Act (ESIGN)</strong> and the
          <strong>Uniform Electronic Transactions Act (UETA)</strong>.
        </p>
      </div>
    </div>

    <template #actions>
      <BaseButton label="Print Proof" :icon="Printer" variant="secondary" @click="printProof" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './buttons/BaseButton.vue'
import { FileSignature, CheckCircle2, ShieldCheck, Printer } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = defineProps<{
  isOpen: boolean
  doc: { label: string; signature: string; date: string } | null
}>()

defineEmits(['close'])
// TODO : Replace with real verification ID generation logic AND SIGNATURE VALIDATION
const verificationId = computed(() => {
  if (!props.doc) return ''
  // Generate a mock but consistent-looking hash based on name and date
  const base = `${props.doc.signature}${props.doc.date}PHOENIX`
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i)
    hash |= 0
  }
  return `SIG-${Math.abs(hash).toString(16).toUpperCase()}-${dayjs(props.doc.date).unix()}`
})

function formatDate(date?: string) {
  if (!date) return 'N/A'
  return dayjs(date).format('MM/DD/YYYY [at] HH:mm')
}

function printProof() {
  window.print()
}
</script>

<style scoped>
@media print {
  /* Hide everything except the modal content */
  :deep(body > *:not(.fixed)) {
    display: none !important;
  }
  
  /* Reset modal positioning for print */
  :deep(.fixed) {
    position: static !important;
    padding: 0 !important;
    background: white !important;
  }

  :deep(.bg-slate-900), 
  :deep(.print\:hidden),
  :deep(button) {
    display: none !important;
  }

  .bg-slate-50 {
    background-color: transparent !important;
    border: 2px solid #e2e8f0 !important;
    box-shadow: none !important;
  }

  .shadow-xl {
    box-shadow: none !important;
  }

  .text-indigo-600 {
    color: #4f46e5 !important;
  }
  
  .bg-indigo-600 {
    background-color: #4f46e5 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .bg-indigo-50 {
    background-color: #f5f3ff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
