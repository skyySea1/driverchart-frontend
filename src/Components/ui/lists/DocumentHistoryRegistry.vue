<template>
  <div v-if="logs.length > 0" class="mt-10 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3
        class="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"
      >
        <History class="w-4 h-4 text-indigo-600" />
        Document Upload History
      </h3>
      <span
        class="text-[9px] font-black text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full uppercase"
      >
        {{ logs.length }} {{ logs.length === 1 ? 'Record' : 'Records' }}
      </span>
    </div>
    <div
      v-if="descriptions && descriptions['Document Upload History']"
      class="text-xs text-slate-500 mt-1"
    >
      {{ descriptions['Document Upload History'] }}
    </div>

    <!-- Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th
              class="px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider"
            >
              Document Type
            </th>
            <th
              class="px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider"
            >
              File Name
            </th>
            <th
              class="px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider"
            >
              Uploaded By
            </th>
            <th
              class="px-4 py-3 text-right text-[10px] font-black text-slate-600 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="log in sortedLogs" :key="log.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-4 py-3 text-xs text-slate-600 font-medium">
              {{ formatDate(log.date) }}
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase"
                :class="getTypeColor(log.type)"
              >
                <component :is="getTypeIcon(log.type)" class="w-3 h-3" />
                {{ formatType(log.type) }}
              </span>
            </td>
            <td
              class="px-4 py-3 text-xs text-slate-700 font-mono max-w-xs truncate"
              :title="log.fileName"
            >
              {{ log.fileName }}
            </td>
            <td class="px-4 py-3 text-xs text-slate-600">
              {{ log.user || 'System' }}
            </td>
            <td class="px-4 py-3 text-right">
              <button
                v-if="log.fileUrl"
                @click="$emit('view-log', log)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg transition-all"
              >
                <Eye class="w-3 h-3" />
                View
              </button>
              <span v-else class="text-[10px] text-slate-400 font-medium"> No file </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="mt-10 bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
    <FileX class="w-12 h-12 text-slate-300 mx-auto mb-3" />
    <p class="text-sm font-bold text-slate-500">No document upload history found</p>
    <p class="text-xs text-slate-400 mt-1">
      Document uploads will appear here once files are added
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  History,
  Eye,
  FileX,
  FileCheck,
  ShieldAlert,
  GraduationCap,
  FileSignature,
  Truck,
  FileText,
} from 'lucide-vue-next'
import type { DocumentLog } from '@/types'
import dayjs from 'dayjs'

const props = defineProps<{
  logs: DocumentLog[]
  descriptions?: Record<string, string>
}>()

defineEmits(['view-log'])

// Sort logs by date (most recent first)
const sortedLogs = computed(() => {
  return [...props.logs].sort((a, b) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  })
})

function formatDate(date: string): string {
  return dayjs(date).format('MMM DD, YYYY h:mm A')
}

function formatType(type: string): string {
  const typeMap: Record<string, string> = {
    license: 'License',
    medical: 'Medical',
    mvr: 'MVR',
    drugAlcohol: 'Clearinghouse',
    roadTest: 'Road Test',
    application: 'Application',
  }
  return typeMap[type] || type
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    license: 'bg-blue-100 text-blue-700',
    medical: 'bg-green-100 text-green-700',
    mvr: 'bg-purple-100 text-purple-700',
    drugAlcohol: 'bg-orange-100 text-orange-700',
    roadTest: 'bg-indigo-100 text-indigo-700',
    application: 'bg-slate-100 text-slate-700',
  }
  return colorMap[type] || 'bg-slate-100 text-slate-700'
}

function getTypeIcon(type: string) {
  const iconMap: Record<string, typeof FileText> = {
    license: FileCheck,
    medical: ShieldAlert,
    mvr: GraduationCap,
    drugAlcohol: FileSignature,
    roadTest: Truck,
    application: FileText,
  }
  return iconMap[type] || FileText
}
</script>
