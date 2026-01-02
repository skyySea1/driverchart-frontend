<!-- src/Views/AuditReportsView.vue -->
<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-slate-800">Operational Overview</h2>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard type="drivers" title="Total Drivers" :value="totalDrivers" :loading="loading" />
      <StatCard
        type="inspections"
        title="Active Fleet"
        :value="`${activeVehicles} / ${totalVehicles}`"
        :loading="loading"
      />
      <StatCard type="alerts" title="Compliance Alerts" :value="alerts.length" :loading="loading" />
      <StatCard type="audit" title="Audit Score" value="94%" :loading="loading" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Alerts -->
      <div
        class="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <header class="p-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <h3 class="flex items-center gap-2 font-semibold text-slate-700">
            <AlertTriangle class="w-4 h-4 text-amber-500" /> Compliance Alerts
          </h3>
          <span
            class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded"
            >Next 30 Days</span
          >
        </header>

        <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
          <template v-if="loading">
            <div
              v-for="i in 3"
              :key="i"
              class="p-4 border border-slate-100 rounded-lg flex justify-between items-center"
            >
              <div class="h-4 skeleton rounded w-1/2"></div>
              <div class="h-4 skeleton rounded w-1/4"></div>
            </div>
          </template>
          <template v-else>
            <p v-if="alerts.length === 0" class="text-center text-slate-400 py-8 italic">
              No active alerts. All systems nominal.
            </p>

            <div
              v-for="alert in alerts"
              :key="alert.id"
              :class="alertClass(alert.type)"
              class="p-3 rounded-lg border-l-4 flex justify-between items-center gap-3 transition-all hover:translate-x-1"
            >
              <div>
                <p class="font-bold text-sm">{{ alert.message }}</p>
                <p class="text-xs opacity-80">Due: {{ alert.dueDate }}</p>
              </div>
              <span class="text-[10px] font-black uppercase tracking-tighter">{{
                alert.type
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- AI Assistant -->
      <div class="rounded shadow bg-white overflow-hidden min-h-75">
        <AiAssistant />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { Alert, Driver, Vehicle } from '@/types'
import { AlertTriangle } from 'lucide-vue-next'
import StatCard from '@/Components/templates/StatCard.vue'
import AiAssistant from '@/Components/templates/AiAssistant.vue'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { parseDriverDoc, parseVehicleDoc } from '@/utils/firestoreParsers'

// Real-time Collections
const appId = import.meta.env.VITE_APP_ID
const { items: drivers, loading: loadingDrivers } = useRealtimeCollection<Driver>(
  `artifacts/${appId}/public/data/drivers`,
  { map: parseDriverDoc },
)
const { items: vehicles, loading: loadingVehicles } = useRealtimeCollection<Vehicle>(
  `artifacts/${appId}/public/data/vehicles`,
  { map: parseVehicleDoc },
)

const loading = computed(() => loadingDrivers.value || loadingVehicles.value)

// Calculate KPIs
const totalDrivers = computed(() => drivers.value.length)
const totalVehicles = computed(() => vehicles.value.length)
const activeVehicles = computed(
  () => vehicles.value.filter((v) => v.vehicleStatus === 'Active').length,
)

// Compliance logic
const alerts = computed<Alert[]>(() => {
  const list: Alert[] = []
  const today = dayjs().startOf('day')

  drivers.value.forEach((d) => {
    // Check if active or default to active if missing
    const status = d.hireStatus
    if (status !== 'Active') return

    const check = (dateStr: string | undefined, label: string) => {
      if (!dateStr) return
      const due = dayjs(dateStr)
      if (!due.isValid()) return

      const diff = due.diff(today, 'day')

      if (diff < 0) {
        list.push({
          id: `${d.id}-${label}`,
          type: 'critical',
          message: `${d.firstName} ${d.lastName}: ${label} expired`,
          dueDate: dateStr,
        })
      } else if (diff <= 30) {
        list.push({
          id: `${d.id}-${label}`,
          type: 'warning',
          message: `${d.firstName} ${d.lastName}: ${label} expiring soon`,
          dueDate: dateStr,
        })
      }
    }

    // data that needs compliance checks
    check(d.cdl?.expiryDate, 'CDL')
    check(d.medical?.expiryDate, 'Medical')
    check(d.mvr?.expiryDate, 'MVR')
  })

  return list.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
})

function alertClass(type: Alert['type']) {
  switch (type) {
    case 'critical':
      return 'bg-red-50 border-red-500 text-red-700'
    case 'warning':
      return 'bg-amber-50 border-amber-500 text-amber-700'
    default:
      return 'bg-slate-50 border-slate-300 text-slate-700'
  }
}
</script>
