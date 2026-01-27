<template>
  <!-- Document (Logs) -->
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
      <History class="w-5 h-5 text-slate-400" /> Document logs
    </h2>
    <div v-if="dedupedDocuments.length === 0" class="text-center py-8 text-slate-500 text-sm">
      No document logs found.
    </div>
    <div v-else
      class="overflow-x-auto overflow-y-auto max-h-87.5 rounded-lg border border-slate-200 custom-scrollbar"
    >
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="doc in dedupedDocuments" :key="doc.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(doc.date, true) }}</td>
            <td class="px-4 py-3 text-sm font-medium text-slate-900">
              Uploaded {{ formatType(doc.type) }} ({{
                doc.fileName ? cleanFileName(doc.fileName) : 'Unknown File'
              }})
            </td>
            <td class="px-4 py-3 text-sm text-slate-500">{{ doc.user || 'Unknown' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { History } from 'lucide-vue-next'
import type { DocumentLog } from '@/types'
import { formatDate, cleanFileName } from '@/utils/utils'
import { SYSTEM_USERS } from '@/utils/constants'

const props = defineProps<{
  data?: DocumentLog[]
}>()

// Format document type for display (Title Case)
function formatType(type: string): string {
  const typeMap: Record<string, string> = {
    license: 'License',
    medical: 'Medical',
    mvr: 'MVR',
    drugAlcohol: 'Clearinghouse',
    roadTest: 'Road Test',
    application: 'Application',
  }
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

// Deduplicated and sorted documents
const dedupedDocuments = computed(() => {
  const logs = props.data ?? []
  if (logs.length === 0) return []

  // Sort by date descending first
  const sorted = [...logs].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())

  // Deduplicate: keep the entry with the "best" user (not 'System Audit' or 'Current User')
  // for entries with matching fileName + type within a 10-second window
  const seen = new Map<string, DocumentLog>()
  const systemUsers = SYSTEM_USERS

  for (const log of sorted) {
    const key = `${(log.fileName || '').toLowerCase()}_${log.type.toLowerCase()}`
    const existing = seen.get(key)

    if (!existing) {
      seen.set(key, log)
    } else {
      // Check if within 10 seconds of each other
      const timeDiff = Math.abs(dayjs(log.date).valueOf() - dayjs(existing.date).valueOf())
      if (timeDiff <= 10000) {
        // Prefer the one with a real user name
        // Map user string to enum value for comparison
        const normalizeUser = (user: string | undefined) => {
          const u = (user || '').toLowerCase()
          if (u === 'system audit' || u === 'system') return 'system'
          if (u === 'current user') return 'current user'
          return u
        }
        const existingIsSystem = systemUsers.includes(normalizeUser(existing.user) as typeof SYSTEM_USERS[number])
        const currentIsSystem = systemUsers.includes(normalizeUser(log.user) as typeof SYSTEM_USERS[number])

        if (existingIsSystem && !currentIsSystem) {
          seen.set(key, log) // Replace with better user
        }
        // Otherwise keep existing (already has real user or both are system)
      } else {
        // Different enough in time, treat as separate entry - use unique key
        seen.set(`${key}_${log.id}`, log)
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
})
</script>
