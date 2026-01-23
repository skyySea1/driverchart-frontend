<!-- src/Views/DriversView.vue -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        <BaseButton @click="openNew" label="Add Driver" />

        <!-- Search Input -->
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-2.5 pl-9"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto justify-end"
      >
        <!-- Use the new FilterDropdown -->
        <FilterDropdown :options="filterOptions" v-model="activeFilters" />

        <div
          class="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-2 rounded-full whitespace-nowrap"
        >
          <template v-if="filteredCount !== driversItems.length">
            {{ filteredCount }} of {{ driversItems.length }} drivers
          </template>
          <template v-else> Total: {{ driversItems.length }} drivers </template>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable
          :columns="tableColumns"
          :items="driversData"
          :loading="loading"
          :current-sort-key="currentSort.key"
          :current-sort-order="currentSort.order"
          @sort="handleSort"
          @row-dblclick="openEdit"
        >
          <template #cell(firstName)="{ item }">
            <router-link
              v-if="item.id"
              :to="{ name: 'driver-profile', params: { id: item.id } }"
              class="font-medium text-slate-800 hover:text-blue-600 hover:underline"
              @dblclick.stop
            >
              {{ capitalizeName(item.firstName) }} {{ capitalizeName(item.lastName) }}
            </router-link>
            <span v-else class="font-medium text-red-500" title="Missing ID">
              {{ capitalizeName(item.firstName) }} {{ capitalizeName(item.lastName) }}
            </span>
          </template>

          <template #cell(hireStatus)="{ value }">
            <span
              :class="['px-2 py-1 rounded-full text-xs font-semibold', getHireStatusColor(value)]"
            >
              {{ value || 'unknown' }}
            </span>
          </template>

          <template #cell(contact)="{ item }">
            <div class="font-medium text-xs text-slate-800">{{ item.phone }}</div>
            <div class="font-extralight text-xs text-slate-800">{{ item.email }}</div>
          </template>

          <template #cell(cdl)="{ item }">
            <div class="group relative inline-block cursor-help">
              <span
                :class="[
                  'px-2 py-1 rounded inline-block text-xs font-bold transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md',
                  getStatusColor(item.cdl?.expiryDate),
                ]"
              >
                <span class="block text-[11px] text-slate-500 font-semibold">{{
                  item.cdl?.expiryDate || '-'
                }}</span>
                <span v-if="item.cdl?.expiryDate" class="block text-[9px] text-slate-500">
                  {{ daysToExpire(item.cdl.expiryDate) }}
                </span>
              </span>

              <!-- Custom Tooltip -->
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto min-w-max p-2.5 bg-white text-white text-[10px] rounded-lg shadow-2xl z-50 text-center transition-all duration-300 ease-out opacity-0 invisible translate-y-2 scale-90 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 border border-slate-300 after:content-[''] after:absolute after:top-full after:left-0 after:w-full after:h-2 select-text"
                @dblclick.stop
              >
                <div class="font-mono font-bold text-slate-700 mb-0.5 tracking-wider text-xs">
                  CDL: {{ item.cdl?.documentNumber || 'N/A' }}
                </div>
                <div class="text-slate-400 text-[10px] font-medium">
                  State: {{ item.cdl?.state || 'N/A' }}
                </div>
                <!-- Tooltip Arrow -->
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"
                ></div>
              </div>
            </div>
          </template>

          <template #cell(medicalExp)="{ value }">
            <span
              :class="['px-2 py-1 rounded inline-block text-xs font-bold', getStatusColor(value)]"
            >
              <span class="block text-[11px] text-slate-500">{{ value || '-' }}</span>
              <span v-if="value" class="block text-[9px] text-slate-500">
                {{ daysToExpire(String(value)) }}
              </span>
            </span>
          </template>

          <template #cell(mvrDate)="{ value }">
            <span
              :class="['px-2 py-1 rounded inline-block text-xs font-bold', getStatusColor(value)]"
            >
              <span class="block text-[11px] text-slate-500">{{ value || '-' }}</span>
              <span v-if="value" class="block text-[9px] text-slate-500">
                {{ daysToExpire(String(value)) }}
              </span>
            </span>
          </template>

          <template #cell(clearinghouseDate)="{ value }">
            <span
              :class="['px-2 py-1 rounded inline-block text-xs font-bold', getStatusColor(value)]"
            >
              <span class="block text-[11px] text-slate-500">{{ value || '-' }}</span>
              <span v-if="value" class="block text-[9px] text-slate-500">
                {{ daysToExpire(String(value)) }}
              </span>
            </span>
          </template>

          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-end gap-2" @dblclick.stop>
              <SmallButton class="p-0.5" @click="openEdit(item)" :icon="Edit" />
              <SmallButton class="p-0.5" @click="runAudit(item)" :icon="Bot" />
              <SmallButton class="p-0.5" @click="confirmDelete(item)" :icon="Trash2" />
            </div>
          </template>
          <template #empty>No drivers match the current filters.</template>
        </DefaultTable>
      </div>
    </div>

    <!-- Global Driver Modal Integrated with Store -->
    <DriverFormModal
      v-if="modalStore.activeModal === 'driver'"
      :driver="modalStore.data as Driver"
      @close="closeModal"
    />

    <!-- Delete confirmation component -->
    <DeleteConfirmation
      :open="!!toDelete"
      :name="toDelete ? `${toDelete.firstName} ${toDelete.lastName}` : ''"
      title="Confirm Deletion"
      @cancel="toDelete = null"
      @confirm="deleteDriver"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import DeleteConfirmation from '@/Components/ui/DeleteConfirmation.vue'
import FilterDropdown, {
  type FilterOptions,
  type FilterState,
} from '@/Components/ui/FilterDropdown.vue'
import { dataService } from '@/services/dataService'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { useCompliance } from '@/Composables/useCompliance'
import { Edit, Trash2, Bot, Search, X } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import { useModalStore } from '@/stores/ModalStore'
import type { Driver, Column, DriverRow, SortOrder } from '@/types'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'
import { parseDriverDoc } from '@/utils/firestoreParsers'
import { capitalizeName, getHireStatusColor, compareValues } from '@/utils/utils'

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()
const { getStatusColor, daysToExpire, isExpiringSoon, isExpired } = useCompliance()
const { items: driversItems, loading } = useRealtimeCollection<Driver>(
  `artifacts/${import.meta.env.VITE_APP_ID}/public/data/drivers`,
  { map: parseDriverDoc },
)

// Search
const searchQuery = ref('')

// Sorting
const currentSort = ref<{ key: string; order: SortOrder }>({ key: '', order: null })

// Filtering Configuration
const filterOptions: FilterOptions = {
  status: {
    label: 'Employment Status',
    items: [
      { label: 'Active', value: 'Active' },
      { label: 'Terminated', value: 'Terminated' },
    ],
  },
  expiration: {
    label: 'Document Compliance',
    items: [
      { label: 'Expiring Soon (30d)', value: 'expiring' },
      { label: 'Expired', value: 'expired' },
    ],
  },
}

// Active Filter State (Unified)
const activeFilters = ref<FilterState>({
  status: [],
  expiration: [],
})

const tableColumns: Column<DriverRow>[] = [
  { key: 'firstName', label: 'Name', align: 'center', sortable: true },
  { key: 'hireStatus', label: 'Status', align: 'center', sortable: true },
  { key: 'contact', label: 'Contact', align: 'center' },
  { key: 'cdl', label: 'Cdl', align: 'center' },
  { key: 'medicalExp', label: 'Medical Exp', align: 'center' },
  { key: 'mvrDate', label: 'Annual MVR', align: 'center' },
  { key: 'clearinghouseDate', label: 'Clearinghouse', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'center' },
]

// Initialize from URL
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = String(route.query.search)
  }

  if (route.query.status) {
    activeFilters.value.status = String(route.query.status).split(',')
  }

  if (route.query.expiration) {
    activeFilters.value.expiration = String(route.query.expiration).split(',')
  }
})

// Sync to URL
watch(
  activeFilters,
  (newFilters) => {
    const query: LocationQuery = { ...route.query }

    // Clean up undefined/null
    Object.keys(query).forEach((key) => query[key] === undefined && delete query[key])

    if (newFilters.status && newFilters.status.length > 0) {
      query.status = newFilters.status.join(',')
    } else {
      delete query.status
    }

    if (newFilters.expiration && newFilters.expiration.length > 0) {
      query.expiration = newFilters.expiration.join(',')
    } else {
      delete query.expiration
    }

    router.replace({ query })
  },
  { deep: true },
)

watch(searchQuery, (val) => {
  const query: LocationQuery = { ...route.query }
  if (val) query.search = val
  else delete query.search
  router.replace({ query })
})

function handleSort(payload: { key: string; order: SortOrder }) {
  currentSort.value = payload
}

const driversData = computed<DriverRow[]>(() => {
  let list = driversItems.value

  // 1. Unified Filter Logic (Multi-select)

  // Status Filter
  const statusFilters = activeFilters.value.status || []
  if (statusFilters.length > 0) {
    list = list.filter((d) => {
      // Check for Active match (Active or Rehired)
      if (statusFilters.includes('Active')) {
        if (d.hireStatus === 'Active' || d.hireStatus === 'Rehired') return true
      }
      // Check for Terminated match
      if (statusFilters.includes('Terminated')) {
        if (d.hireStatus !== 'Active' && d.hireStatus !== 'Rehired') return true
      }
      return false
    })
  }

  // Expiration Filter
  const expirationFilters = activeFilters.value.expiration || []
  if (expirationFilters.length > 0) {
    list = list.filter((d) => {
      let match = false
      if (expirationFilters.includes('expiring')) {
        match =
          match ||
          isExpiringSoon(d.cdl?.expiryDate) ||
          isExpiringSoon(d.medical?.expiryDate) ||
          isExpiringSoon(d.drugAlcohol?.expiryDate) ||
          isExpiringSoon(d.mvr?.expiryDate)
      }
      if (expirationFilters.includes('expired')) {
        match =
          match ||
          isExpired(d.cdl?.expiryDate) ||
          isExpired(d.medical?.expiryDate) ||
          isExpired(d.drugAlcohol?.expiryDate) ||
          isExpired(d.mvr?.expiryDate)
      }
      return match
    })
  }

  // 3. Search Filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter((d) => {
      const fullName = `${d.firstName} ${d.lastName}`.toLowerCase()
      return (
        (d.id && d.id.toLowerCase().includes(query)) ||
        fullName.includes(query) ||
        d.firstName.toLowerCase().includes(query) ||
        d.lastName.toLowerCase().includes(query)
      )
    })
  }

  // Map to DriverRow first
  const mappedList = list.map((d) => {
    const driverRow: DriverRow = {
      ...d,
      firstName: d.firstName || '',
      middleName: d.middleName || '',
      lastName: d.lastName || '',
      contact: d.phone || '',
      cdlExp: d.cdl?.expiryDate || '',
      medicalExp: d.medical?.expiryDate || '',
      mvrDate: d.mvr?.expiryDate || '',
      clearinghouseDate: d.drugAlcohol?.expiryDate || '',
      hireStatus: d.hireStatus === 'Rehired' ? 'Active' : d.hireStatus || 'Active',
    }
    return driverRow
  })

  // Apply Sort
  if (currentSort.value.key && currentSort.value.order) {
    const { key, order } = currentSort.value
    const sortedList = [...mappedList]
    sortedList.sort((a, b) => {
      const valA = a[key as keyof DriverRow]
      const valB = b[key as keyof DriverRow]

      // Type guard: only compare primitives (string/number)
      if (typeof valA === 'string' || typeof valA === 'number') {
        if (typeof valB === 'string' || typeof valB === 'number') {
          return compareValues(valA, valB, order)
        }
      }
      return 0
    })
    return sortedList
  }

  return mappedList
})

const filteredCount = computed(() => driversData.value.length)

const toDelete = ref<Driver | null>(null)

// Store-based modal controls
function openNew() {
  modalStore.openModal('driver')
}

function openEdit(d: Driver) {
  modalStore.openModal('driver', d)
}

function closeModal() {
  modalStore.closeModal()
}

function confirmDelete(d: Driver) {
  toDelete.value = d
}

async function deleteDriver() {
  if (!toDelete.value) return
  try {
    await dataService.deleteDriver(toDelete.value.id)
    toDelete.value = null
  } catch (err) {
    console.error('Error deleting driver:', err)
  }
}

function runAudit(d: Driver) {
  alert(`AI Audit (simulated) for ${d.firstName} ${d.lastName}`)
}
</script>
