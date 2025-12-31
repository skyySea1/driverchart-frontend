<!-- src/Views/DriversView.vue -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <BaseButton @click="openNew" label="Add Driver" />
      
      <div class="flex items-center gap-4 w-full sm:w-auto justify-end">
        <div class="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full whitespace-nowrap">
          <template v-if="statusFilter !== 'all'">
            {{ filteredCount }} of {{ driversItems.length }} drivers
          </template>
          <template v-else>
            Total: {{ driversItems.length }} drivers
          </template>
        </div>

        <!-- Status Filter Combobox -->
        <div class="relative min-w-48">
          <select 
            v-model="statusFilter"
            class="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
          >
            <option value="all">All Drivers</option>
            <option value="expiring">Expiring Soon (30d)</option>
            <option value="expired">Expired Documents</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <Filter class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <DefaultTable :columns="tableColumns" :items="drivers" :loading="loading">

          <template #cell(firstName)="{ item }">
            <span class="font-medium text-slate-800">{{ item.firstName }} {{ item.lastName }}</span>
          </template>

          <template #cell(hireStatus)="{ value }">
            <span :class="['px-2 py-1 rounded-full text-xs font-semibold', value === 'Active' || !value
                ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800',
            ]">
              {{ value || 'Active' }}
            </span>
          </template>

          <template #cell(contact)="{ item }">
            <div class="font-medium text-xs text-slate-800">{{ item.phone }}</div>
            <div class="font-extralight text-xs text-slate-800">{{ item.email }}</div>
          </template>

          <template #cell(cdlExp)="{ value }">
            <span :class="['px-2 py-1  rounded inline-block text-xs font-bold', getStatusColor(value)]">
              <span class="block text-[11px] text-slate-500 text-xs">
                {{ value || '-' }}
              </span>
              <span v-if="value" class="block text-[9px] text-slate-500 text-xs">
                {{ daysToExpire(value) }}
              </span>
            </span>
          </template>

          <template #cell(medicalExp)="{ value }">
            <span :class="['px-2 py-1  rounded inline-block text-xs font-bold', getStatusColor(value)]">
              <span class="block text-[11px] text-slate-500 text-xs">
                {{ value || '-' }}
              </span>
              <span v-if="value" class="block text-[9px] text-slate-500 text-xs">
                {{ daysToExpire(value) }}
              </span>
            </span>
          </template>

          <template #cell(mvrDate)="{ value }">
            <span :class="['px-2 py-1  rounded inline-block text-xs font-bold', getStatusColor(value)]">
              <span class="block text-[11px] text-slate-500 text-xs">
                {{ value || '-' }}
              </span>
              <span v-if="value" class="block text-[9px] text-slate-500 text-xs">
                {{ daysToExpire(value) }}
              </span>
            </span>
          </template>

          <template #cell(clearinghouseDate)="{ value }">
            <span :class="['px-2 py-1  rounded inline-block text-xs font-bold', getStatusColor(value)]">
              <span class="block text-[11px] text-slate-500 text-xs">
                {{ value || '-' }}
              </span>
              <span v-if="value" class="block text-[9px] text-slate-500 text-xs">
                {{ daysToExpire(value) }}
              </span>
            </span>
          </template>

          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-end gap-2">
              <TableButton @click="openEdit(item)" :icon="Edit"/>
              <TableButton @click="runAudit(item)" :icon="Bot" />
              <TableButton @click="confirmDelete(item)" :icon="Trash2"/>
            </div>
          </template>

          <template #empty>No drivers match the selected filter.</template>
        </DefaultTable>
      </div>
    </div>

    <!-- Global Driver Modal Integrated with Store -->
    <DriverFormModal v-if="modalStore.activeModal === 'driver'" :driver="modalStore.data as Driver"
      @close="closeModal" />

    <!-- Delete confirmation component -->
    <DeleteConfirmation :open="!!toDelete" :name="toDelete ? `${toDelete.firstName} ${toDelete.lastName}` : ''"
      title="Confirm Deletion" @cancel="toDelete = null" @confirm="deleteDriver" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
  import DeleteConfirmation from '@/Components/ui/DeleteConfirmation.vue'
  import { dataService } from '@/services/dataService'
  import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
  import { useCompliance } from '@/Composables/useCompliance'
  import { Edit, Trash2, Bot, Filter } from 'lucide-vue-next'
  import BaseButton from '@/Components/ui/BaseButton.vue'
  import DefaultTable from '@/Components/templates/DefaultTable.vue'
  import { useModalStore } from '@/stores/ModalStore'
  import type { Driver, Column, DriverRow } from '@/types'
import TableButton from '@/Components/ui/TableButton.vue'

  const modalStore = useModalStore()
  const { getStatusColor, daysToExpire, isExpiringSoon, isExpired } = useCompliance()
  const { items: driversItems, loading } = useRealtimeCollection<Driver>(
    `artifacts/${import.meta.env.VITE_APP_ID}/public/data/drivers`,
  )

  const statusFilter = ref<'all' | 'expiring' | 'expired'>('all')

  const tableColumns: Column[] = [
    { key: 'firstName', label: 'Name' },
    { key: 'hireStatus', label: 'Status' },
    { key: 'contact', label: 'Contact', align: 'center' },
    { key: 'cdlExp', label: 'CDL Exp', align: 'center' },
    { key: 'medicalExp', label: 'Medical Exp', align: 'center' },
    { key: 'mvrDate', label: 'Annual MVR', align: 'center' },
    { key: 'clearinghouseDate', label: 'Clearinghouse', align: 'center' },
    { key: 'actions', label: 'Actions', align: 'right' },
  ]

  const drivers = computed<DriverRow[]>(() => {
    let list = driversItems.value

    if (statusFilter.value === 'expiring') {
      list = list.filter(d => 
        isExpiringSoon(d.cdl?.expiryDate) || 
        isExpiringSoon(d.medical?.expiryDate) || 
        isExpiringSoon(d.drugAlcohol?.expiryDate) || 
        isExpiringSoon(d.mvr?.expiryDate)
      )
    } else if (statusFilter.value === 'expired') {
      list = list.filter(d => 
        isExpired(d.cdl?.expiryDate) || 
        isExpired(d.medical?.expiryDate) || 
        isExpired(d.drugAlcohol?.expiryDate) || 
        isExpired(d.mvr?.expiryDate)
      )
    }

    return list.map((d) => ({
      ...d,
      hireStatus: d.hireStatus || 'Active',
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate,
    }))
  })

  const filteredCount = computed(() => drivers.value.length)

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

  // todo add toastr or similar notification
  function runAudit(d: Driver) {
    alert(`AI Audit (simulated) for ${d.firstName} ${d.lastName}`)
  }
</script>