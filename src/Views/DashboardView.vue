<!-- src/Views/DashboardView.vue -->
<template>
  <div class="space-y-6">

    <!-- Top StatsCard Bar -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      <StatCard
        type="alerts"
        title="Alerts"
        :value="statsData?.alertsCount ?? 0"
        :loading="isLoading"
        is-clickable
        @click="handleFilterClick({ expiration: ['expiring', 'expired'] })"
      />
      <StatCard
        type="license"
        title="Expiring Licenses"
        :value="statsData?.expiringLicense ?? 0"
        :loading="isLoading"
        is-clickable
        @click="handleFilterClick({ expiration: 'expiring' })"
      />
      <StatCard
        type="clearinghouse"
        title="Expiring Clearinghouses"
        :value="statsData?.expiringClearinghouse ?? 0"
        :loading="isLoading"
        is-clickable
        @click="handleFilterClick({ expiration: 'expiring' })"
      />
      <StatCard
        type="medical"
        title="Expiring Med Cards"
        :value="statsData?.expiringMedCards ?? 0"
        :loading="isLoading"
        is-clickable
        @click="handleFilterClick({ expiration: 'expiring' })"
      />
      <StatCard
        type="applications"
        title="New Applications"
        :value="statsData?.newApplications ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/applications')"
      />
      <StatCard
        type="reviews"
        title="Annual MVR Review"
        :value="statsData?.annualRecordReview ?? 0"
        :loading="isLoading"
        is-clickable
        @click="handleFilterClick({ expiration: 'expiring' })"
      />
      <StatCard
        type="audit"
        title="Audit Score"
        :value="statsData?.auditScore ?? '0%'"
        :loading="isLoading"
        is-clickable
      />
    </div>

    <!-- Priority Alerts Section -->
    <div class="bg-white p-4 rounded-xl shadow">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4" :class="{ 'mb-4': isAlertsExpanded }">
        <div class="flex items-center gap-3">
          <button
            @click="isAlertsExpanded = !isAlertsExpanded"
            class="p-1 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors text-slate-500"
            :title="isAlertsExpanded ? 'Collapse alerts' :  'Expand alerts'"
          >
            <ChevronDown
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-180': !isAlertsExpanded }"
            />
          </button>
          <h3 class="font-semibold text-slate-800 flex items-center gap-2 m-0">
            <Bell class="w-4 h-4 text-orange-500" />
            Priority Compliance Alerts
          </h3>
        </div>

        <div class="flex items-center gap-4">
          <!-- Critical Only Toggle -->
          <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span class="text-xs font-semibold text-slate-600">Critical Only</span>
            <BaseToggle v-model="showCriticalOnly" />
          </div>

          <!-- Alert Type Dropdown -->
          <FilterDropdown
            :options="alertFilterOptions"
            v-model="alertFilters"
          />
        </div>
      </div>
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0 overflow-hidden"
        enter-to-class="max-h-[1000px] opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="max-h-[1000px] opacity-100"
        leave-to-class="max-h-0 opacity-0 overflow-hidden"
      >
        <div v-if="isAlertsExpanded">
          <ul class="mt-3 space-y-2">
            <template v-if="isLoading && !statsData">
              <li
                v-for="i in 3"
                :key="i"
                class="p-3 border border-slate-100 rounded flex justify-between"
              >
                <div class="h-4 skeleton rounded w-1/2"></div>
                <div class="h-4 skeleton rounded w-1/4"></div>
              </li>
            </template>
            <template v-else>
              <li
                v-for="a in filteredAlerts"
                :key="a.entityName + a.message"
                @click="navigateToDriver(a)"
                class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div class="text-slate-700">
                      <span class="font-bold text-blue-600 group-hover:underline">
                        {{ capitalizeName(a.entityName || 'Driver') }}
                      </span>
                      : {{ capitalizeName(a.message) }}
                    </div>

                    <div
                      class="inline-flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <SmallButton
                        :icon="Edit"
                        v-if="a.entityId"
                        @click.stop="openEditModal(a)"
                        class="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit Driver"
                      />
                      <SmallButton
                        :icon="Upload"
                        v-if="a.entityId"
                        @click.stop="openQuickUpload(a)"
                        class="text-slate-400 hover:text-green-600 hover:bg-green-50"
                        title="Quick Upload Document"
                      />
                    </div>
                  </div>
                  <div
                    class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors"
                  >
                    {{ formatDate(a.dueDate) }}
                  </div>
                </div>
              </li>
              <li
                v-if="filteredAlerts.length === 0"
                class="text-slate-500 text-sm italic py-4 text-center"
              >
                No critical compliance issues found. Take a water break!
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Drivers Module Section -->
    <div class="mt-6" ref="driversSection">
      <DriversModule />
    </div>

    <!-- Global Driver Modal Integrated with Store -->
    <DriverFormModal
      v-if="modalStore.activeModal === 'driver'"
      :driver="modalStore.data as Driver"
      @close="modalStore.closeModal()"
    />

    <!-- Quick Upload Modal -->
    <DocumentUploadModal
      v-if="isUploadModalOpen && selectedDriver"
      :isOpen="isUploadModalOpen"
      :driverId="selectedDriver.id!"
      :driverName="
        [selectedDriver.firstName, selectedDriver.middleName, selectedDriver.lastName]
          .filter(Boolean)
          .join(' ')
      "
      :documentType="selectedDocType"
      :currentExpiry="currentDocExpiry"
      @close="isUploadModalOpen = false"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute, type LocationQueryRaw } from 'vue-router'
import StatCard from '@/Components/templates/StatCard.vue'
import DriversModule from '@/Components/templates/DriversModule.vue'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import DocumentUploadModal from '@/Components/templates/forms/DocumentUploadModal.vue'
import FilterDropdown, { type FilterOptions, type FilterState } from '@/Components/ui/FilterDropdown.vue'
import BaseToggle from '@/Components/ui/BaseToggle.vue'
import { Bell, Edit, Upload, ChevronDown } from 'lucide-vue-next'
import { useDashboard } from '@/Composables/useDashboard'
import dayjs from 'dayjs'
import type { Alert, Driver } from '@/types'
import { capitalizeName } from '@/utils/utils'
import { useModalStore } from '@/stores/ModalStore'
import { dataService } from '@/services/dataService'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'

const router = useRouter()
const route = useRoute()
const { statsData, isLoading, fetchDashboardStats } = useDashboard()
const modalStore = useModalStore()

// Refs
const driversSection = ref<HTMLElement | null>(null)
const isAlertsExpanded = ref(false)
// Upload Modal State
const isUploadModalOpen = ref(false)
const selectedDriver = ref<Driver | null>(null)
const selectedDocType = ref('')
const currentDocExpiry = ref('')

const priorityAlerts = computed(() => {
  return statsData.value?.alerts || []
})

const alertFilters = ref<FilterState>({
  type: []
})

const alertFilterOptions: FilterOptions = {
  type: {
    label: 'Alert Type',
    items: [
      { label: 'License', value: 'license' },
      { label: 'Medical', value: 'medical' },
      { label: 'Clearinghouse', value: 'clearinghouse' },
      { label: 'MVR', value: 'mvr' },
      { label: 'Other', value: 'other' }
    ]
  }
}

const showCriticalOnly = ref(false)

const filteredAlerts = computed(() => {
  let list = [...priorityAlerts.value]

  // 1. Critical Only Filter
  if (showCriticalOnly.value) {
    list = list.filter(a => a.type === 'critical')
  }

  // 2. Type Multi-select Filter
  const selectedTypes = alertFilters.value.type || []
  if (selectedTypes.length > 0) {
    list = list.filter(a => {
      const docType = mapAlertToDocType(a.message)
      return selectedTypes.includes(docType)
    })
  }

  return list
})

const formatDate = (date?: string) => {
  if (!date) return '-'
  return dayjs(date).format('MM/DD/YYYY')
}

function handleFilterClick(newQuery: LocationQueryRaw) {
  router.replace({
    query: { ...route.query, ...newQuery },
  })
  driversSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToDriver = (alert: Alert) => {
  const searchTerm = alert.entityName || alert.entity
  if (searchTerm) {
    handleFilterClick({ search: searchTerm })
  }
}

async function openEditModal(alert: Alert) {
  if (!alert.entityId) return

  try {
    const driver = await dataService.getDriverById(alert.entityId)
    if (driver) {
      modalStore.openModal('driver', driver)
    }
  } catch (e) {
    console.error('Failed to fetch driver for edit', e)
  }
}

const mapAlertToDocType = (message: string): string => {
  const msg = message.toLowerCase()
  if (msg.includes('medical')) return 'medical'
  if (msg.includes('license')) return 'license'
  if (msg.includes('clearinghouse')) return 'drugAlcohol'
  if (msg.includes('record review') || msg.includes('mvr')) return 'mvr'
  if (msg.includes('road test')) return 'roadTest'
  return 'other'
}

async function openQuickUpload(alert: Alert) {
  if (!alert.entityId) return

  try {
    const driver = await dataService.getDriverById(alert.entityId)
    if (driver) {
      selectedDriver.value = driver
      selectedDocType.value = mapAlertToDocType(alert.message)

      // Get current expiry if exists
      const docType = selectedDocType.value
      if (docType !== 'other') {
        // @ts-expect-error Chart.js types are tricky
        currentDocExpiry.value = driver[docType]?.expiryDate || ''
      } else {
        currentDocExpiry.value = ''
      }

      isUploadModalOpen.value = true
    }
  } catch (e) {
    console.error('Failed to fetch driver for quick upload', e)
  }
}

function handleUploadSuccess() {
  isUploadModalOpen.value = false
  fetchDashboardStats(true) // Silent refresh of stats to update alerts
}
</script>
