<template>
  <div class="space-y-6">
    <div class="flex justify-between">
      <h2 class="text-lg font-bold text-slate-800">Applications Section</h2>
      <p class="text-[10px] justify-en font-bold text-slate-400 uppercase tracking-widest">
        Check Applicant Profile for approval
      </p>
      <a
        href="/apply"
        target="_blank"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
      >
        Open Application Form <ExternalLink class="w-4 h-4" />
      </a>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full lg:max-w-xl">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search applicants..."
          class="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-2.5 pl-10"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 ease-in-out"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Status Pills -->
      <div class="flex items-center gap-2">
        <button
          v-for="status in statusPills"
          :key="status.value"
          @click="selectedStatus = status.value"
          class="transition-all duration-200"
        >
          <BaseBadge
            :variant="selectedStatus === status.value ? 'blue' : 'secondary'"
            class="px-3 py-1 cursor-pointer border-slate-200"
          >
            {{ status.label }} ({{ status.count }})
          </BaseBadge>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable
          :columns="tableColumns"
          :items="sortedApplications"
          :loading="loading"
          :current-sort-key="currentSort.key"
          :current-sort-order="currentSort.order"
          @sort="handleSort"
          @row-dblclick="openApplicantProfile"
        >
          <template #cell(firstName)="{ item }">
            <router-link
              v-if="item.id"
              :to="{ name: 'applicant-profile', params: { id: item.id } }"
              class="font-medium text-slate-800 hover:text-blue-600 hover:underline"
            >
              {{ capitalizeName(item.personalInfo.firstName) }}
              {{ capitalizeName(item.personalInfo.lastName) }}
            </router-link>
            <span v-else class="font-medium text-slate-800"
              >{{ capitalizeName(item.personalInfo.firstName) }}
              {{ capitalizeName(item.personalInfo.lastName) }}</span
            >
          </template>

          <template #cell(contact)="{ item }">
            <div class="font-medium text-xs text-slate-800">{{ item.personalInfo.phone }}</div>
            <div class="font-extralight text-xs text-slate-800">{{ item.personalInfo.email }}</div>
          </template>

          <template #cell(licenseNumber)="{ item }">
            <div class="font-medium text-xs text-slate-800">{{ item.licenses[0]?.number }}</div>
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

          <template #empty>No applications found.</template>
        </DefaultTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { dataService } from '@/services/dataService'
import type { Applications, Column } from '@/types'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import { ExternalLink, Search, X } from 'lucide-vue-next'
import { capitalizeName, compareValues } from '@/utils/utils'
import BaseBadge from '@/Components/ui/BaseBadge.vue'

const applications = ref<Applications[]>([])
const loading = ref(false)
const currentSort = ref<{ key: string; order: 'asc' | 'desc' | null }>({ key: '', order: null })
const router = useRouter()
const searchQuery = ref('')
const selectedStatus = ref('all')

const statusPills = computed(() => [
  { label: 'All', value: 'all', count: applications.value.length },
  {
    label: 'Pending',
    value: 'Pending',
    count: applications.value.filter((a) => a.status === 'Pending').length,
  },
  {
    label: 'Approved',
    value: 'Approved',
    count: applications.value.filter((a) => a.status === 'Approved').length,
  },
  {
    label: 'Rejected',
    value: 'Rejected',
    count: applications.value.filter((a) => a.status === 'Rejected').length,
  },
])

const tableColumns: Column<Applications>[] = [
  { key: 'firstName', label: 'Name', align: 'center', sortable: true },
  { key: 'contact', label: 'Contact', align: 'center' },
  { key: 'licenseNumber', label: 'License', align: 'center' },
  { key: 'appliedDate', label: 'Applied Date', align: 'center', sortable: true },
  { key: 'status', label: 'Status', align: 'center', sortable: true },
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

function handleSort(payload: { key: string; order: 'asc' | 'desc' | null }) {
  currentSort.value = payload
}

function openApplicantProfile(item: Applications) {
  if (item.id) {
    router.push({ name: 'applicant-profile', params: { id: item.id } })
  }
}
// review what kinda of sort is implemented here
const sortedApplications = computed<Applications[]>(() => {
  let list = [...applications.value] // Create a shallow copy to sort

  // Status Filter
  if (selectedStatus.value !== 'all') {
    list = list.filter((a) => a.status === selectedStatus.value)
  }

  // Search Filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter((a) => {
      const fullName = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase()
      return (
        fullName.includes(query) ||
        a.personalInfo.email.toLowerCase().includes(query) ||
        a.personalInfo.phone.includes(query)
      )
    })
  }

  if (currentSort.value.key && currentSort.value.order) {
    const { key, order } = currentSort.value
    list.sort((a, b) => {
      const valA = a[key as keyof Applications]
      const valB = b[key as keyof Applications]

      // Ensure values match comparedValues type (string | number | null | undefined)
      if (
        (typeof valA === 'string' ||
          typeof valA === 'number' ||
          valA === null ||
          valA === undefined) &&
        (typeof valB === 'string' ||
          typeof valB === 'number' ||
          valB === null ||
          valB === undefined)
      ) {
        return compareValues(valA, valB, order)
      }
      return 0
    })
  }

  return list
})

onMounted(() => {
  fetchApplications()
})
</script>
