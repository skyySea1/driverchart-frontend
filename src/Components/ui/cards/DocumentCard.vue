<template>
  <div
    class="group relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all',
            doc.file
              ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm'
              : 'bg-slate-50 text-slate-300 border-slate-100',
          ]"
        >
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-black text-slate-900 text-xs uppercase tracking-tight">
            {{ doc.label }}
          </h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
            {{ doc.cfr || 'FMCSA Requirement' }}
          </p>
        </div>
      </div>
      <div v-if="doc.file" class="bg-green-100 text-green-700 p-1 rounded-lg">
        <CheckCircle2 class="w-4 h-4" />
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-3">
      <div
        v-if="doc.expiryDate"
        class="bg-slate-50 rounded-lg p-2 flex justify-between items-center text-[10px] font-black uppercase tracking-tighter"
      >
        <span class="text-slate-400">Expiration Date</span>
        <span :class="statusColor">{{ formatDate(doc.expiryDate) }}</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="doc.file && doc.file !== 'APP_EXISTS'"
          @click="$emit('view', doc)"
          class="cursor-pointer text-center py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 flex-1"
        >
          <Eye class="w-3 h-3" /> View
        </button>
        <button
          v-if="doc.file === 'APP_EXISTS'"
          @click="$emit('view-application')"
          class="cursor-pointer text-center py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 flex-1"
        >
          <FileText class="w-3 h-3" /> View Application
        </button>
        <button
          v-if="doc.key !== 'application'"
          @click="$emit('upload', doc.key)"
          :class="[
            'flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm',
            doc.file
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-indigo-600 text-white hover:bg-indigo-700',
          ]"
        >
          <Upload class="w-3 h-3" /> {{ doc.file ? 'Update' : 'Upload' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  FileText,
  CheckCircle2,
  Upload,
  Eye,
  FileCheck,
  ShieldAlert,
  GraduationCap,
  FileSignature,
  Truck,
} from 'lucide-vue-next'
import dayjs from 'dayjs'

interface DocumentData {
  key: string
  label: string
  cfr?: string
  file?: string | null
  expiryDate?: string
}

const props = defineProps<{
  doc: DocumentData
}>()

defineEmits(['view', 'upload', 'view-application'])

const icon = computed(() => {
  switch (props.doc.key) {
    case 'license':
      return FileCheck
    case 'medical':
      return ShieldAlert
    case 'mvr':
      return GraduationCap
    case 'drugAlcohol':
      return FileSignature
    case 'roadTest':
      return Truck
    default:
      return FileText
  }
})

const statusColor = computed(() => {
  if (!props.doc.expiryDate) return 'text-slate-400'
  const today = dayjs().startOf('day')
  const exp = dayjs(props.doc.expiryDate)
  const diff = exp.diff(today, 'day')

  if (diff < 0) return 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded'
  if (diff <= 30) return 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded'
  return 'text-green-600 bg-green-50 px-1.5 py-0.5 rounded'
})

function formatDate(date?: string) {
  if (!date || date === 'APP_EXISTS') return 'N/A'
  return dayjs(date).format('MM/DD/YYYY')
}
</script>
