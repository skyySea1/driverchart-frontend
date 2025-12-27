<!-- src/Views/Vehicles.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <PrimaryButton @click="openNew" label="Add Vehicle" />
    </div>

    <DefaultTable :columns="tableColumns" :items="vehicles" :loading="loading">
      <template #cell(busNumber)="{ item }">
        <div class="font-bold text-slate-800 flex items-center gap-2">
          <Bus :size="16" class="text-slate-400" /> {{ item.busNumber }}
        </div>
      </template>

      <template #cell(vin)="{ value }">
        <span class="font-mono text-xs">{{ value }}</span>
      </template>

      <template #cell(vehicleStatus)="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            value === STATUS_ACTIVE
              ? 'bg-green-100 text-green-700'
              : value === STATUS_MAINTENANCE
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-700',
          ]"
        >
          {{ value || STATUS_INACTIVE }}
        </span>
      </template>

      <template #cell(nextDue)="{ item }">
        <span class="font-medium text-blue-600">{{
          nextInspectionFor(item.lastAnnualInspection)
        }}</span>
      </template>

      <template #cell(mileage)="{ value }"> {{ (value ?? 0).toLocaleString() }} mi </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center gap-2">
          <button class="text-slate-400 hover:text-blue-600 cursor-pointer" title="Upload Docs">
            <UploadCloud :size="18" />
          </button>
          <button
            @click="confirmDelete(item)"
            class="text-slate-400 hover:text-red-600 cursor-pointer"
            title="Delete Vehicle"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </template>

      <template #empty>No vehicles found. Click "Add Vehicle" to start tracking.</template>
    </DefaultTable>

    <!-- Global Vehicle Modal Integrated with Store -->
    <BaseModal
      :is-open="modalStore.activeModal === 'vehicle'"
      title="Register New Vehicle"
      size="max-w-md"
      @close="closeModal"
    >
      <VehicleForm @saved="reload" @cancel="closeModal" />
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
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Bus, UploadCloud, Trash2 } from 'lucide-vue-next'
import type { Vehicle } from '@/types'
import { dataService } from '@/services/dataService'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import BaseModal from '@/Components/ui/BaseModal.vue'
import PrimaryButton from '@/Components/ui/PrimaryButton.vue'
import VehicleForm from '@/Components/ui/VehicleForm.vue'
import DeleteConfirmation from '@/Components/ui/DeleteConfirmation.vue'
import { useModalStore } from '@/stores/useModalStore'
import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_MAINTENANCE } from '@/utils/constants'

const modalStore = useModalStore()
const vehicles = ref<Vehicle[]>([])
const loading = ref(false)
const toDelete = ref<Vehicle | null>(null)

const tableColumns = [
  { key: 'busNumber', label: 'Bus #' },
  { key: 'vin', label: 'VIN' },
  { key: 'vehicleStatus', label: 'Status' },
  { key: 'lastAnnualInspection', label: 'Last Annual Insp.' },
  { key: 'nextDue', label: 'Next Due' },
  { key: 'mileage', label: 'Mileage' },
  { key: 'actions', label: 'Actions' },
]

// Fetch vehicle data
async function fetchVehicles() {
  loading.value = true
  try {
    vehicles.value = await dataService.getVehicles()
  } catch (err) {
    console.error('Error fetching vehicles:', err)
  } finally {
    loading.value = false
  }
}

// Open modal using store
function openNew() {
  modalStore.openModal('vehicle')
}

// Close modal and reset store state
function closeModal() {
  modalStore.closeModal()
}

// Reload data after save
function reload() {
  closeModal()
  fetchVehicles()
}

function confirmDelete(v: Vehicle) {
  toDelete.value = v
}

async function deleteVehicle() {
  if (!toDelete.value) return
  try {
    await dataService.deleteVehicle(toDelete.value.id)
    toDelete.value = null
    fetchVehicles()
  } catch (err) {
    console.error('Error deleting vehicle:', err)
  }
}

onMounted(() => {
  fetchVehicles()
})

// Calculate next inspection date
function nextInspectionFor(last?: string) {
  if (!last) return '-'
  return dayjs(last).add(1, 'year').format('YYYY-MM-DD')
}
</script>
