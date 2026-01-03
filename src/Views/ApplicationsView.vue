<!-- src/Views/ApplicationsView.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold text-slate-800">Driver Applications</h2>
      <a
        href="/apply"
        target="_blank"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
      >
        Open Application Form <ExternalLink class="w-4 h-4" />
      </a>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable :columns="tableColumns" :items="applications" :loading="loading">
          <template #cell(firstName)="{ item }">
            <span class="font-medium text-slate-800">{{ item.firstName }} {{ item.lastName }}</span>
          </template>

          <template #cell(contact)="{ item }">
            <div class="font-medium text-xs text-slate-800">{{ item.phone }}</div>
            <div class="font-extralight text-xs text-slate-800">{{ item.email }}</div>
          </template>

          <template #cell(status)="{ value }">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                value === 'Approved'
                  ? 'bg-green-100 text-green-800'
                  : value === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800',
              ]"
            >
              {{ value }}
            </span>
          </template>

          <template #cell(appliedDate)="{ value }">
            <span class="text-sm text-slate-500">{{ value }}</span>
          </template>

          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-end gap-2" v-if="item.status === 'Pending'">
              <button
                @click="updateStatus(item.id, 'Approved')"
                class="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                title="Approve"
              >
                <Check class="w-4 h-4" />
              </button>
              <button
                @click="updateStatus(item.id, 'Rejected')"
                class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Reject"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </template>

          <template #empty>No applications found.</template>
        </DefaultTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dataService } from '@/services/dataService'
import type { Application, Column } from '@/types'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import { Check, X, ExternalLink } from 'lucide-vue-next'

const applications = ref<Application[]>([])
const loading = ref(false)

const tableColumns: Column[] = [
  { key: 'firstName', label: 'Name', align: 'center' },
  { key: 'contact', label: 'Contact', align: 'center' },
  { key: 'cdlNumber', label: 'CDL #', align: 'center' },
  { key: 'experienceYears', label: 'Exp (Yrs)', align: 'center' },
  { key: 'appliedDate', label: 'Applied Date', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

async function fetchApplications() {
  loading.value = true
  try {
    applications.value = await dataService.getApplications()
  } catch (err) {
    console.error('Error fetching applications:', err)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: string, status: 'Approved' | 'Rejected') {
  // Optimistically update local state to avoid refetching the full list
  const index = applications.value.findIndex((app) => app.id === id)
  if (index === -1) {
    console.warn(`Application with id ${id} not found`)
    return
  }

  const app = applications.value[index]
  if (!app) return

  const previousStatus = app.status
  applications.value[index] = {
    ...app,
    status,
  }

  try {
    await dataService.updateApplicationStatus(id, status)
  } catch (err) {
    console.error('Error updating status:', err)
    // Revert optimistic update on error to keep local state consistent
    const currentApp = applications.value[index]
    if (currentApp) {
      applications.value[index] = {
        ...currentApp,
        status: previousStatus,
      }
    }
  }
}

onMounted(() => {
  fetchApplications()
})
</script>
