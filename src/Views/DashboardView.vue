<!-- src/Views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Top Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      <StatCard
        type="alerts"
        title="Alerts"
        :value="statsData?.alertsCount ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
      <StatCard
        type="CDL"
        title="Expiring CDLs"
        :value="statsData?.expiringCDL ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?expiration=expiring')"
      />
      <StatCard
        type="clearinghouse"
        title="Expiring Clearinghouses"
        :value="statsData?.expiringClearinghouse ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?expiration=expiring')"
      />
      <StatCard
        type="medical"
        title="Expiring Med Cards"
        :value="statsData?.expiringMedCards ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?expiration=expiring')"
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
        title="Annual Record Review"
        :value="statsData?.annualRecordReview ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
      <StatCard
        type="audit"
        title="Audit Score"
        :value="statsData?.auditScore ?? '0%'"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
    </div>
<!-- padronize for use the same alert component -->
    <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Priority Alerts Section -->
      <div class="lg:col-span-2">
        <div class="bg-white p-4 rounded-xl shadow h-full">
          <h3 class="font-semibold text-slate-800 flex items-center gap-2">
            <Bell class="w-4 h-4 text-orange-500" />
            Priority Compliance Alerts
          </h3>

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
                v-for="a in priorityAlerts"
                :key="a.entityName"
                @click="navigateToDriver(a)"
                class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div class="flex justify-between items-center">

                   <div class="flex justify-between items-center">
                                   <div class="text-slate-700">
                    <span class="font-bold text-blue-600 group-hover:underline">
                      {{ capitalizeName(a.entityName || 'Driver') }} </span
                    >: {{ capitalizeName(a.message) }}

                    <SmallButton
                    :icon="Edit"
                      v-if="a.entityId"
                      @click.stop="openEditModal(a)"
                      class="p-1 button-base text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                      title="Edit Driver"
                    >
                    </SmallButton>
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
                v-if="priorityAlerts.length === 0"
                class="text-slate-500 text-sm italic py-4 text-center"
              >
                No critical compliance issues found. Take a water break!
              </li>
            </template>
          </ul>
        </div>
      </div>

      <!-- AI Assistant Section -->
      <div class="rounded shadow bg-white overflow-hidden min-h-75">
        <AiAssistant />
      </div>
    </div>

    <!-- Global Driver Modal Integrated with Store -->
    <DriverFormModal
      v-if="modalStore.activeModal === 'driver'"
      :driver="modalStore.data as Driver"
      @close="modalStore.closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '@/Components/templates/StatCard.vue'
import AiAssistant from '@/Components/templates/AiAssistant.vue'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import { Bell, Edit } from 'lucide-vue-next'
import { useDashboard } from '@/Composables/useDashboard'
import dayjs from 'dayjs'
import type { Alert, Driver } from '@/types'
import { capitalizeName } from '@/utils/utils'
import { useModalStore } from '@/stores/ModalStore'
import { dataService } from '@/services/dataService'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'

const router = useRouter()
const { statsData, isLoading } = useDashboard()
const modalStore = useModalStore()

const priorityAlerts = computed(() => {
  return statsData.value?.alerts || []
})

const formatDate = (date?: string) => {
  if (!date) return '-'
  return dayjs(date).format('MM/DD/YYYY')
}

const navigateToDriver = (alert: Alert) => {
  const searchTerm = alert.entityName || alert.entity
  if (searchTerm) {
    router.push({
      path: '/drivers',
      query: { search: searchTerm }
    })
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
</script>
