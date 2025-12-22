<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <PrimaryButton @click="openNew" label="Add Vehicle" />
    </div>

    <DefaultTable :columns="tableColumns" :items="vehicles">
      <template #cell(busNumber)="{ item }">
        <div class="font-bold text-slate-800 flex items-center gap-2">
          <Bus :size="16" class="text-slate-400" /> {{ item.busNumber }}
        </div>
      </template>

      <template #cell(vin)="{ value }">
        <span class="font-mono text-xs">{{ value }}</span>
      </template>

      <template #cell(status)="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            value === STATUS_ACTIVE
              ? 'bg-green-100 text-green-700'
              : value === STATUS_MAINTENANCE
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-700'
          ]"
        >
          {{ value || STATUS_INACTIVE }}
        </span>
      </template>

      <template #cell(nextDue)="{ item }">
        <span class="font-medium text-blue-600">{{ nextInspectionFor(item.lastAnnualInspection) }}</span>
      </template>

      <template #cell(mileage)="{ value }">
        {{ (value ?? 0).toLocaleString() }} mi
      </template>

      <template #cell(actions)="{ item }">
        <button class="text-slate-400 hover:text-blue-600">
          <UploadCloud :size="18" />
        </button>
      </template>

      <template #empty>No vehicles found. Click "Add Vehicle" to start tracking.</template>
    </DefaultTable>

    <Modal :is-open="isModalOpen" title="Register New Vehicle" size="max-w-md" @close="isModalOpen = false">
      <VehicleForm @saved="reload" @cancel="isModalOpen = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Bus, UploadCloud } from 'lucide-vue-next'
import type { Vehicle } from '@/types'
import { dataService } from '@/services/dataService'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import Modal from '@/Components/ui/Modal.vue'
import PrimaryButton from '@/Components/ui/PrimaryButton.vue'
import VehicleForm from '@/Components/ui/VehicleForm.vue'
import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_MAINTENANCE } from '@/utils/constants'

const vehicles = ref<Vehicle[]>([])
const isModalOpen = ref(false)
const loading = ref(false)

const tableColumns = [
  { key: 'busNumber', label: 'Bus #' },
  { key: 'vin', label: 'VIN' },
  { key: 'status', label: 'Status' },
  { key: 'lastAnnualInspection', label: 'Last Annual Insp.' },
  { key: 'nextDue', label: 'Next Due' },
  { key: 'mileage', label: 'Mileage' },
  { key: 'actions', label: 'Docs' },
]

function openNew() {
  isModalOpen.value = true
}

async function fetchVehicles() {
  loading.value = true
  try {
    vehicles.value = await dataService.getVehicles()
  } catch (e) {
    console.error("Error fetching vehicles:", e)
  } finally {
    loading.value = false
  }
}

function reload() {
  isModalOpen.value = false
  fetchVehicles()
}

onMounted(() => {
  fetchVehicles()
})

function nextInspectionFor(last?: string) {
  if (!last) return '-'
  return dayjs(last).add(1, 'year').format('YYYY-MM-DD')
}

</script>
