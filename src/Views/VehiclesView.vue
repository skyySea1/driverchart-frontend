<!-- src/Views/VehiclesView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header / Actions -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <BaseButton label="Add Vehicle" :icon="Plus" @click="openNew" class="shadow-sm" />

        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by bus # or VIN..."
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
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto justify-end"
      >
        <!-- Filter Dropdown -->
        <FilterDropdown :options="filterOptions" v-model="activeFilters" />

        <div
          class="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-2 rounded-full whitespace-nowrap"
        >
          <template v-if="filteredCount !== vehiclesItems.length">
            {{ filteredCount }} of {{ vehiclesItems.length }} vehicles
          </template>
          <template v-else> Total: {{ vehiclesItems.length }} vehicles </template>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable
          :columns="tableColumns"
          :items="vehiclesData"
          :loading="loading"
          :current-sort-key="currentSort.key"
          :current-sort-order="currentSort.order"
          @sort="handleSort"
          @row-dblclick="openEdit"
        >
          <template #cell(busNumber)="{ item }">
            <div class="font-bold text-slate-800 flex items-center gap-2">
              <Bus :size="16" class="text-slate-400" /> {{ item.busNumber }}
            </div>
          </template>

          <template #cell(vin)="{ value }">
            <span
              class="font-mono text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
              >{{ value }}</span
            >
          </template>

          <template #cell(vehicleStatus)="{ value }">
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                value === STATUS_ACTIVE
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : value === STATUS_MAINTENANCE
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200',
              ]"
            >
              {{ value || STATUS_INACTIVE }}
            </span>
          </template>

          <template #cell(nextDue)="{ item }">
            <span
              :class="[
                'px-2 py-1 rounded inline-block text-xs font-bold',
                getStatusColor(nextInspectionFor(item.lastAnnualInspection)),
              ]"
            >
              <span class="block text-[11px] text-slate-500">{{
                nextInspectionFor(item.lastAnnualInspection) || '-'
              }}</span>
              <span v-if="item.lastAnnualInspection" class="block text-[9px] text-slate-500">
                {{ daysToExpire(nextInspectionFor(item.lastAnnualInspection)) }}
              </span>
            </span>
          </template>

          <template #cell(mileage)="{ value }">
            <span class="font-medium text-slate-700">{{ (value ?? 0).toLocaleString() }}</span>
            <span class="text-xs text-slate-400 ml-1">mi</span>
          </template>

          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-end gap-2" @dblclick.stop>
              <SmallButton class="p-0.5" @click="openEdit(item)" :icon="Edit" />
              <SmallButton class="p-0.5" @click="confirmDelete(item)" :icon="Trash2" />
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="bg-slate-50 p-4 rounded-full mb-3">
                <Bus class="w-8 h-8 text-slate-300" />
              </div>
              <h3 class="text-sm font-medium text-slate-900">No vehicles found</h3>
              <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Get started by adding a new vehicle to your fleet or try adjusting your search
                filters.
              </p>
              <BaseButton
                label="Add Vehicle"
                :icon="Plus"
                size="sm"
                class="mt-4"
                @click="openNew"
              />
            </div>
          </template>
        </DefaultTable>
      </div>
    </div>

    <!-- Global Vehicle Modal Integrated with Store -->
    <BaseModal
      :is-open="modalStore.activeModal === 'vehicle'"
      :title="modalStore.data ? 'Edit Vehicle' : 'Register New Vehicle'"
      size="max-w-md"
      @close="closeModal"
    >
      <VehicleForm
        :initial-data="modalStore.data as Vehicle"
        @saved="onVehicleSaved"
        @cancel="closeModal"
      />
    </BaseModal>

    <!-- Delete confirmation component -->
    <DeleteConfirmation
      :open="!!toDelete"
      :name="toDelete ? `Bus #${toDelete.busNumber}` : ''"
      title="Confirm Deletion"
      @cancel="toDelete = null"
      @confirm="deleteVehicle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute, type LocationQuery } from 'vue-router'
import dayjs from 'dayjs'
import { Bus, Trash2, Plus, Search, X, Edit } from 'lucide-vue-next'
import type { Vehicle, Column } from '@/types'
import { dataService } from '@/services/dataService'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { useCompliance } from '@/Composables/useCompliance'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import BaseModal from '@/Components/ui/BaseModal.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'
import VehicleForm from '@/Components/templates/forms/VehicleForm.vue'
import DeleteConfirmation from '@/Components/ui/DeleteConfirmation.vue'
import FilterDropdown, {
  type FilterOptions,
  type FilterState,
} from '@/Components/ui/FilterDropdown.vue'
import { useModalStore } from '@/stores/ModalStore'
import {
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  STATUS_MAINTENANCE,
  COLLECTION_PATHS,
} from '@/utils/constants'
import { compareValues } from '@/utils/utils'

import { parseVehicleDoc } from '@/utils/firestoreParsers'

const router = useRouter()
const route = useRoute()
const modalStore = useModalStore()
const { getStatusColor, daysToExpire } = useCompliance()

// Fetch Data
const { items: vehiclesItems, loading } = useRealtimeCollection<Vehicle>(
  COLLECTION_PATHS.vehicles,
  {
    map: parseVehicleDoc,
  },
)

const toDelete = ref<Vehicle | null>(null)
const searchQuery = ref('')
const currentSort = ref<{ key: string; order: 'asc' | 'desc' | null }>({ key: '', order: null })

// Filtering Config
const filterOptions: FilterOptions = {
  status: {
    label: 'Vehicle Status',
    items: [
      { label: 'Active', value: 'Active' },
      { label: 'Maintenance', value: 'Maintenance' },
      { label: 'Inactive', value: 'Inactive' },
    ],
  },
}

const activeFilters = ref<FilterState>({
  status: [],
})

const tableColumns: Column<Vehicle>[] = [
  { key: 'busNumber', label: 'Bus #', sortable: true },
  { key: 'vin', label: 'VIN', sortable: true },
  { key: 'vehicleStatus', label: 'Status', align: 'center', sortable: true },
  { key: 'lastAnnualInspection', label: 'Last Annual Insp.', align: 'center', sortable: true },
  { key: 'nextDue', label: 'Next Due', align: 'center' }, // derived
  { key: 'mileage', label: 'Mileage', align: 'right', sortable: true },
  { key: 'actions', label: 'Actions', align: 'center' },
]

// Initialize from URL
onMounted(() => {
  if (route.query.search) searchQuery.value = String(route.query.search)
  if (route.query.status) activeFilters.value.status = String(route.query.status).split(',')
})

// Sync URL
watch(
  activeFilters,
  (newFilters) => {
    const query: LocationQuery = { ...route.query }
    if (newFilters.status && newFilters.status.length > 0)
      query.status = newFilters.status.join(',')
    else delete query.status
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

function handleSort(payload: { key: string; order: 'asc' | 'desc' | null }) {
  currentSort.value = payload
}

// Computed Data
const vehiclesData = computed(() => {
  let list = vehiclesItems.value

  // Filter: Status
  const statusFilters = activeFilters.value.status || []
  if (statusFilters.length > 0) {
    list = list.filter((v) => statusFilters.includes(v.vehicleStatus || STATUS_INACTIVE))
  }

  // Filter: Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (v) => v.busNumber.toLowerCase().includes(q) || v.vin.toLowerCase().includes(q),
    )
  }

  // Sort
  if (currentSort.value.key && currentSort.value.order) {
    const { key, order } = currentSort.value
    const sorted = [...list]
    sorted.sort((a, b) => {
      const rawA = a[key]
      const rawB = b[key]
      const valA = typeof rawA === 'string' || typeof rawA === 'number' ? rawA : null
      const valB = typeof rawB === 'string' || typeof rawB === 'number' ? rawB : null
      // Handle derived 'nextDue' sort if needed, or mapped fields
      // Simple direct property sort for now
      return compareValues(valA, valB, order)
    })
    return sorted
  }

  return list
})

const filteredCount = computed(() => vehiclesData.value.length)

// Actions
function openNew() {
  modalStore.openModal('vehicle')
}

function openEdit(v: Vehicle) {
  modalStore.openModal('vehicle', v)
}

function closeModal() {
  modalStore.closeModal()
}

function onVehicleSaved() {
  closeModal()
}

function confirmDelete(v: Vehicle) {
  toDelete.value = v
}

async function deleteVehicle() {
  if (!toDelete.value) return
  try {
    await dataService.deleteVehicle(toDelete.value.id)
    toDelete.value = null
  } catch (err) {
    console.error('Error deleting vehicle:', err)
  }
}

// Helper
function nextInspectionFor(last?: string) {
  if (!last) return ''
  return dayjs(last).add(1, 'year').format('YYYY-MM-DD')
}
</script>
