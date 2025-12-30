<!-- src/Views/DriversView.vue -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <BaseButton @click="openNew" label="Add Driver" />
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable :columns="tableColumns" :items="drivers" :loading="loading">
          <template #cell(firstName)="{ item }">
            <span class="font-medium text-slate-800">{{ item.firstName }} {{ item.lastName }}</span>
          </template>

          <template #cell(hireStatus)="{ value }">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                value === 'Active' || !value
                  ? 'bg-green-100 text-green-800'
                  : 'bg-slate-100 text-slate-800',
              ]"
            >
              {{ value || 'Active' }}
            </span>
          </template>

          <template #cell(cdlExp)="{ value }">
            <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(value)]">{{
              value || '-'
            }}</span>
          </template>
          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="openEdit(item)"
                class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button
                @click="runAudit(item)"
                class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
              >
                <Bot class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(item)"
                class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </template>

          <template #empty>No drivers found. Click "Add Driver" to start tracking.</template>
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
import { ref, computed } from 'vue'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import DeleteConfirmation from '@/Components/ui/DeleteConfirmation.vue'
import { dataService } from '@/services/dataService'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { statusColorFor } from '@/Composables/useDotHelpers'
import { Edit, Trash2, Bot } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/BaseButton.vue'
import DefaultTable from '@/Components/templates/DefaultTable.vue'
import { useModalStore } from '@/stores/ModalStore'
import type { Driver, Column, DriverRow } from '@/types'

const modalStore = useModalStore()

const tableColumns: Column[] = [
  { key: 'firstName', label: 'Name' },
  { key: 'hireStatus', label: 'Status' },
  { key: 'contact', label: 'Contact' },
  { key: 'cdlExp', label: 'CDL Exp', align: 'center' },
  { key: 'medicalExp', label: 'Medical Exp', align: 'center' },
  { key: 'mvrDate', label: 'Annual MVR', align: 'center' },
  { key: 'clearinghouseDate', label: 'Clearinghouse', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const { items: driversItems, loading } = useRealtimeCollection<Driver>(
  `artifacts/${import.meta.env.VITE_APP_ID}/public/data/drivers`,
)

const drivers = computed<DriverRow[]>(() => {
  return driversItems.value.map((d) => ({
    ...d,
    hireStatus: d.hireStatus || 'Active',
    contact: d.phone,
    cdlExp: d.cdl?.expiryDate,
    medicalExp: d.medical?.expiryDate,
    mvrDate: d.mvr?.expiryDate,
    clearinghouseDate: d.drugAlcohol?.expiryDate,
  }))
})

const toDelete = ref<Driver | null>(null)

// Map dates to status colors
function statusColor(date: string) {
  if (!date) return 'text-slate-500'
  const statusClass = statusColorFor(date)
  if (statusClass.includes('bg-red')) return 'bg-red-100 text-red-800'
  if (statusClass.includes('bg-yellow') || statusClass.includes('bg-amber'))
    return 'bg-amber-100 text-amber-800'
  if (statusClass.includes('bg-green')) return 'bg-green-100 text-green-800'
  return 'text-slate-500'
}

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

// todo add toastr or similar notification
function runAudit(d: Driver) {
  alert(`AI Audit (simulated) for ${d.firstName} ${d.lastName}`)
}
</script>
