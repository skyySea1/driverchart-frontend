<!-- src/Components/templates/DriversModule.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900" data-testid="drivers-module-title">
          Drivers List
        </h1>
        <p class="text-sm text-slate-500">Manage all drivers</p>
      </div>

      <!-- Driver Actions -->
      <div class="flex gap-2">
        <BaseButton
          @click="generateDriverListReport(driversData)"
          label="Export List"
          :icon="FileText"
        />
        <BaseButton
          @click="openNew"
          label="Add Driver"
          :icon="Plus"
          class="bg-blue-600 hover:bg-blue-800"
        />
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <SearchInput v-model="searchQuery" />

      <!-- Status Pills & Compliance Filter -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <button
            v-for="status in statusPills"
            :key="status.value"
            @click="selectedStatus = status.value"
            class="transition-all duration-200"
            v-cursor
          >
            <BaseBadge
              :variant="selectedStatus === status.value ? 'blue' : 'secondary'"
              class="px-3 py-1 cursor-pointer border-slate-200"
            >
              {{ status.label }} ({{ status.count }})
            </BaseBadge>
          </button>
        </div>
        <FilterDropdown :options="filterOptions" v-model="activeFilters" :compact="props.compact" />
      </div>
    </div>

    <div class="overflow-x-auto -mx-6 px-6 border-t border-slate-100 min-h-100">
      <DefaultTable
        :columns="tableColumns"
        :items="driversData"
        :loading="loading"
        :current-sort-key="currentSort.key"
        :current-sort-order="currentSort.order"
        :compact="props.compact"
        @sort="handleSort"
        @row-dblclick="openEdit"
        @row-click="openProfile"
      >
        <template #cell(firstName)="{ item }">
          <router-link
            :to="{ name: 'driver-profile', params: { id: item.id } }"
            class="font-medium text-slate-800 hover:text-blue-600 hover:underline cursor-pointer"
            @click.stop
          >
            {{ capitalizeName(item.firstName) }} {{ capitalizeName(item.lastName) }}
          </router-link>
        </template>

        <template #cell(hireStatus)="{ value }">
          <span
            :class="[
              'rounded-full font-semibold',
              props.compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
              getHireStatusColor(value),
            ]"
          >
            {{ value || 'unknown' }}
          </span>
        </template>

        <template #cell(contact)="{ item }">
          <div
            class="font-medium text-slate-800"
            :class="props.compact ? 'text-[10px]' : 'text-xs'"
          >
            {{ item.phone }}
          </div>
          <div
            class="font-extralight text-slate-800"
            :class="props.compact ? 'text-[10px]' : 'text-xs'"
          >
            {{ item.email }}
          </div>
        </template>

        <template #cell(license)="{ item }">
          <div class="group relative inline-block cursor-help">
            <span
              :class="[
                'rounded inline-block font-bold transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md',
                props.compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
                getStatusColor(item.license?.expiryDate),
              ]"
            >
              <span
                class="block text-slate-500 font-semibold"
                :class="props.compact ? 'text-[9px]' : 'text-[11px]'"
                >{{ item.license?.expiryDate || '-' }}</span
              >
              <span
                v-if="item.license?.expiryDate"
                class="block text-slate-500"
                :class="props.compact ? 'text-[8px]' : 'text-[9px]'"
              >
                {{ daysToExpire(item.license.expiryDate) }}
              </span>
            </span>

            <!-- Custom Tooltip -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto min-w-max p-2.5 bg-white text-white text-[10px] rounded-lg shadow-2xl z-50 text-center transition-all duration-300 ease-out opacity-0 invisible translate-y-2 scale-90 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 border border-slate-300 after:content-[''] after:absolute after:top-full after:left-0 after:w-full after:h-2 select-text"
              @dblclick.stop
            >
              <div class="font-mono font-bold text-slate-700 mb-0.5 tracking-wider text-xs">
                license: {{ item.license?.documentNumber || 'N/A' }}
              </div>
              <div class="text-slate-400 text-[10px] font-medium">
                State: {{ item.license?.state || 'N/A' }}
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
            :class="[
              'rounded inline-block font-bold',
              props.compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
              getStatusColor(value as string),
            ]"
          >
            <span
              class="block text-slate-500"
              :class="props.compact ? 'text-[9px]' : 'text-[11px]'"
              >{{ value || '-' }}</span
            >
            <span
              v-if="value"
              class="block text-slate-500"
              :class="props.compact ? 'text-[8px]' : 'text-[9px]'"
            >
              {{ daysToExpire(String(value)) }}
            </span>
          </span>
        </template>

        <template #cell(mvrDate)="{ value }">
          <span
            :class="[
              'rounded inline-block font-bold',
              props.compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
              getStatusColor(value as string),
            ]"
          >
            <span
              class="block text-slate-500"
              :class="props.compact ? 'text-[9px]' : 'text-[11px]'"
              >{{ value || '-' }}</span
            >
            <span
              v-if="value"
              class="block text-slate-500"
              :class="props.compact ? 'text-[8px]' : 'text-[9px]'"
            >
              {{ daysToExpire(String(value)) }}
            </span>
          </span>
        </template>

        <template #cell(clearinghouseDate)="{ value }">
          <span
            :class="[
              'rounded inline-block font-bold',
              props.compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
              getStatusColor(value as string),
            ]"
          >
            <span
              class="block text-slate-500"
              :class="props.compact ? 'text-[9px]' : 'text-[11px]'"
              >{{ value || '-' }}</span
            >
            <span
              v-if="value"
              class="block text-slate-500"
              :class="props.compact ? 'text-[8px]' : 'text-[9px]'"
            >
              {{ daysToExpire(String(value)) }}
            </span>
          </span>
        </template>

        <template #cell(actions)="{ item }">
          <div class="flex items-center justify-end gap-2" @dblclick.stop>
            <SmallButton class="p-0.5" @click.stop="openEdit(item)" :icon="Edit" />
            <SmallButton class="p-0.5" @click.stop="confirmDelete(item)" :icon="Trash2" />
          </div>
        </template>
        <template #empty>No drivers match the current filters.</template>
      </DefaultTable>
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
import { Edit, Trash2, Plus, FileText } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseBadge from '@/Components/ui/badges/BaseBadge.vue'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import { useModalStore } from '@/stores/ModalStore'
import type { Driver, Column, DriverRow, SortOrder } from '@/types'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'
import { parseDriverDoc } from '@/utils/firestoreParsers'
import { capitalizeName, getHireStatusColor, compareValues } from '@/utils/utils'
import { useDriverListReport } from '@/Composables/useDriverListReport'
import SearchInput from '../ui/inputs/SearchInput.vue'

const props = defineProps<{ compact?: boolean }>()

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()
const { getStatusColor, daysToExpire, isExpiringSoon, isExpired } = useCompliance()
const { generateDriverListReport } = useDriverListReport()
const { items: driversItems, loading } = useRealtimeCollection<Driver>(
  `artifacts/${import.meta.env.VITE_COLLECTION_ID}/public/data/drivers`,
  { map: parseDriverDoc },
)

// Search
const searchQuery = ref('')

// Sorting
const currentSort = ref<{ key: string; order: SortOrder }>({ key: '', order: null })

// Status Filter Pill state
const selectedStatus = ref('all')

const statusPills = computed(() => [
  { label: 'All', value: 'all', count: driversItems.value.length },
  {
    label: 'Active',
    value: 'active',
    count: driversItems.value.filter((d) => d.hireStatus === 'Active' || d.hireStatus === 'Rehired')
      .length,
  },
  {
    label: 'Pending',
    value: 'pending',
    count: driversItems.value.filter((d) => d.hireStatus === 'Pending').length,
  },
  {
    label: 'Terminated',
    value: 'terminated',
    count: driversItems.value.filter(
      (d) => !['Active', 'Rehired', 'Pending'].includes(d.hireStatus || 'Active'),
    ).length,
  },
])

// Filtering Configuration (Compliance)
const filterOptions: FilterOptions = {
  expiration: {
    label: 'Document Compliance',
    items: [
      { label: 'Expiring Soon (30d)', value: 'expiring' },
      { label: 'Expired', value: 'expired' },
    ],
  },
}

// Active Filter State (Unified for Compliance)
const activeFilters = ref<FilterState>({
  expiration: [],
})

const tableColumns: Column<DriverRow>[] = [
  { key: 'firstName', label: 'Name', align: 'center', sortable: true },
  { key: 'hireStatus', label: 'Status', align: 'center', sortable: true },
  { key: 'contact', label: 'Contact', align: 'center' },
  { key: 'license', label: 'License', align: 'center' },
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
    selectedStatus.value = String(route.query.status)
  }

  if (route.query.expiration) {
    activeFilters.value.expiration = String(route.query.expiration).split(',')
  }
})

// Listen for search changes in URL (e.g. from Dashboard alerts)
watch(
  () => route.query.search,
  (newSearch) => {
    if (newSearch !== undefined) {
      searchQuery.value = String(newSearch)
    } else {
      searchQuery.value = ''
    }
  },
)

// Listen for status changes in URL
watch(
  () => route.query.status,
  (newStatus) => {
    if (newStatus && newStatus !== selectedStatus.value) {
      selectedStatus.value = String(newStatus)
    } else if (!newStatus && selectedStatus.value !== 'all') {
      selectedStatus.value = 'all'
    }
  },
)

// Listen for expiration changes in URL
watch(
  () => route.query.expiration,
  (newExpiration) => {
    const current = activeFilters.value.expiration || []
    const next = newExpiration ? String(newExpiration).split(',') : []

    const isSame = current.length === next.length && current.every((v, i) => v === next[i])

    if (!isSame) {
      activeFilters.value.expiration = next
    }
  },
)

// Sync to URL
watch(
  [activeFilters, selectedStatus],
  ([newCompliance, newStatus]) => {
    const query: LocationQuery = { ...route.query }

    // Clean up undefined/null
    Object.keys(query).forEach((key) => query[key] === undefined && delete query[key])

    if (newStatus && newStatus !== 'all') {
      query.status = newStatus
    } else {
      delete query.status
    }

    if (newCompliance.expiration && newCompliance.expiration.length > 0) {
      query.expiration = newCompliance.expiration.join(',')
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

  // 1. Unified Filter Logic (Pill Status)
  if (selectedStatus.value !== 'all') {
    list = list.filter((d) => {
      if (selectedStatus.value === 'active') {
        return d.hireStatus === 'Active' || d.hireStatus === 'Rehired'
      }
      if (selectedStatus.value === 'pending') {
        return d.hireStatus === 'Pending'
      }
      if (selectedStatus.value === 'terminated') {
        return !['Active', 'Rehired', 'Pending'].includes(d.hireStatus || 'Active')
      }
      return true
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
          isExpiringSoon(d.license?.expiryDate) ||
          isExpiringSoon(d.medical?.expiryDate) ||
          isExpiringSoon(d.drugAlcohol?.expiryDate) ||
          isExpiringSoon(d.mvr?.expiryDate)
      }
      if (expirationFilters.includes('expired')) {
        match =
          match ||
          isExpired(d.license?.expiryDate) ||
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
      licenseExp: d.license?.expiryDate || '',
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
      const valA = a[key]
      const valB = b[key]

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

const toDelete = ref<Driver | null>(null)

// Store-based modal controls
function openNew() {
  modalStore.openModal('driver')
}

function openEdit(d: Driver) {
  modalStore.openModal('driver', d)
}

function openProfile(d: DriverRow) {
  if (d && d.id) {
    router.push({ name: 'driver-profile', params: { id: d.id } })
  }
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
</script>
