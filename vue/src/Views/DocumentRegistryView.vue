<!--  src/Views/DocumentRegistryView.vue -->
<template>
  <!-- Document Registry Card -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden">

    <!-- Header -->
    <div class="p-6 border-b border-slate-100 flex flex-col space-y-4">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-slate-800">Document Registry &amp; Audit Log</h3>
          <p class="text-slate-500 text-sm">Centralized repository for all compliance uploads.</p>
        </div>
      </div>

      <!-- Tab Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div class="flex space-x-2 bg-slate-100 p-1 rounded-lg self-start">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center',
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            ]"
            @click="activeTab = tab.id"
          >
          <!-- TODO SET VISUALIZATIONS  -->
            <component :is="tab.icon" class="w-4 h-4 mr-2" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Search Filter -->
        <div class="flex items-center relative">
          <Search class="w-4 h-4 text-slate-400  absolute left-3 top-2.5" />
          <input
            v-model="filter"
            placeholder="Search by name or entity..."
            class="p-2 border border-slate-200 rounded-lg text-sm w-64 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
            <th class="p-4 border-b">Upload Date</th>
            <th class="p-4 border-b">Document Name</th>
            <th class="p-4 border-b">Type</th>
            <th class="p-4 border-b">Related Entity</th>
            <th class="p-4 border-b">Uploaded By</th>
            <th class="p-4 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody class="text-sm text-slate-700 divide-y divide-slate-100">
          <!-- Skeleton State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="p-4"><div class="h-4 skeleton rounded w-24"></div></td>
              <td class="p-4"><div class="h-4 skeleton rounded w-48"></div></td>
              <td class="p-4"><div class="h-4 skeleton rounded w-20"></div></td>
              <td class="p-4"><div class="h-4 skeleton rounded w-32"></div></td>
              <td class="p-4"><div class="h-4 skeleton rounded w-24"></div></td>
              <td class="p-4"><div class="h-4 skeleton rounded w-12 ml-auto"></div></td>
            </tr>
          </template>
          <tr v-else-if="filtered.length === 0">
            <td colspan="6" class="p-8 text-center text-slate-400">
              No documents found in this category.
            </td>
          </tr>
          <tr v-for="doc in filtered" :key="doc.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4">{{ formatDate(doc.date) }}</td>
            <td class="p-4">{{ doc.fileName }}</td>
            <td class="p-4">{{ doc.type }}</td>
            <td class="p-4">{{ doc.entityName }}</td>
            <td class="p-4">{{ doc.user || 'system' }}</td>
            <td class="p-4 text-right">
              <button class="text-indigo-600 hover:text-indigo-800 text-sm">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { History, User, Bus, Search } from 'lucide-vue-next'
import type { DocumentLog } from '@/types'
import { dataService } from '@/services/dataService'

const entries = ref<DocumentLog[]>([])
const filter = ref('')
const activeTab = ref('history')
const loading = ref(false)

const tabs = [
  { id: 'history', label: 'General History', icon: History },
  { id: 'drivers', label: 'Driver Docs', icon: User },
  { id: 'fleet', label: 'Fleet Docs', icon: Bus },
]

async function fetchLogs() {
  loading.value = true
  try {
    entries.value = await dataService.getDocumentLogs()
  } catch (err) {
    console.error("Error fetching logs:", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})

const filtered = computed<DocumentLog[]>(() => {
  if (!filter.value) return entries.value
  const f = filter.value.toLowerCase()
  return entries.value.filter((e) =>
    (e.entityName || '').toLowerCase().includes(f) ||
    (e.fileName || '').toLowerCase().includes(f),
  )
})

function formatDate(value: unknown): string {
  if (!value) return '-'
  if (typeof value === 'string') {
    return value.slice(0, 10)
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return '-'
}
</script>
