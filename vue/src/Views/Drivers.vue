<!-- /src/Views/Drivers.vue -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <PrimaryButton  @click="openNew" label="Add Driver"/>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">

    <DefaultTable :columns="tableColumns" :items="drivers" :loading="loading">
      <template #cell(firstName)="{ item }">
        <span class="font-medium text-slate-800">{{ item.firstName }} {{ item.lastName }}</span>
      </template>

      <template #cell(status)="{ value }">
        <span :class="['px-2 py-1 rounded-full text-xs font-semibold', value === 'Active' || !value ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800']">
          {{ value || 'Active' }}
        </span>
      </template>

      <template #cell(cdlExp)="{ value }">
        <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(value)]">{{ value || '-' }}</span>
      </template>
      <template #cell(actions)="{ item }">
        <div  class="flex items-center justify-end gap-2">
          <button @click="openEdit(item)" class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="runAudit(item)" class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer">
            <Bot class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(item)" class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>

      <template #empty>No drivers found. Click "Add Driver" to start tracking.</template>
    </DefaultTable>
  </div>

      </div>
    </div>

    <DriverFormModal v-if="showModal" :driver="editing" @close="closeModal" @saved="reload" />

    <!-- Delete confirmation double modal simplified -->
    <div v-if="toDelete" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-red-600 flex items-center gap-2">
          <Trash2 class="w-5 h-5" /> Confirmar Exclusão
        </h3>
        <p class="mt-3 text-slate-600">
          Are you sure you want to delete <strong>{{ toDelete.firstName }} {{ toDelete.lastName }}</strong>?
          <br>This action is permanent and cannot be undone.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="toDelete=null" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer">Cancel</button>
          <button @click="deleteDriver" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow cursor-pointer">Delete permanently</button>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DriverFormModal from '../Components/templates/forms/DriverFormModal.vue'
import { dataService } from '@/services/dataService'
import { statusColorFor } from '../Composables/useDotHelpers'
import { Edit, Trash2, Bot } from 'lucide-vue-next'
import  PrimaryButton from '@/Components/ui/PrimaryButton.vue'
import DefaultTable from '@/Components/templates/DefaultTable.vue';
import type { Column } from '@/types'

interface Driver {
  id: string
  firstName: string
  lastName: string
  status?: string
  contact?: string
  cdlExp?: string
  medicalExp?: string
  mvrDate?: string
  clearinghouseDate?: string
  [key: string]: any
}


const tableColumns: Column[] = [
  { key: 'firstName', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'contact', label: 'Contact' },
  { key: 'cdlExp', label: 'CDL Exp', align: 'center' },
  { key: 'medicalExp', label: 'Medical Exp', align: 'center' },
  { key: 'mvrDate', label: 'Annual MVR', align: 'center' },
  { key: 'clearinghouseDate', label: 'Clearinghouse', align: 'center' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

const drivers = ref<Driver[]>([])
const showModal = ref(false)
const editing = ref<Driver  | undefined>(undefined)
const toDelete = ref<Driver | null>(null)
const loading = ref(false)

async function fetchDrivers() {
  loading.value = true
  try {
    drivers.value = await dataService.getDrivers()
  } catch (e) {
    console.error("Error fetching drivers:", e)
  } finally {
    loading.value = false
  }
}

// Adapting helper to return full tailwind classes if possible, but keeping logic
function statusColor(date: string | undefined | null) {
  if (!date) return 'text-slate-500'
  // Map helper outputs to specific tailwind badge styles
  const cls = statusColorFor(date)
  if (cls.includes('bg-red')) return 'bg-red-100 text-red-800'
  if (cls.includes('bg-yellow') || cls.includes('bg-amber')) return 'bg-amber-100 text-amber-800'
  if (cls.includes('bg-green')) return 'bg-green-100 text-green-800'
  return 'text-slate-500'
}

function openNew() {
  editing.value = undefined
  showModal.value = true
}

function openEdit(d: Driver) {
  editing.value = { ...d }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function reload() {
  fetchDrivers()
}

function confirmDelete(d: Driver) {
  toDelete.value = d
}

async function deleteDriver() {
  if (!toDelete.value) return
  try {
    await dataService.deleteDriver(toDelete.value.id)
    toDelete.value = null
    reload()
  } catch (e) {
    console.error("Error deleting driver:", e)
  }
}

function runAudit(d: Driver) {
  // Simular auditoria IA
  alert(`Auditoria IA (simulada) para ${d.firstName} ${d.lastName}`)
}

onMounted(() => {
  fetchDrivers()
})
</script>
