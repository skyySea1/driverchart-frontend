<!-- src/Views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Top Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <StatCard type="alerts" title="Alerts" :value="alertsCount" :loading="isLoading" />
      <StatCard
        type="licenses"
        title="Expiring Licenses"
        :value="stats.expiringLicenses"
        :loading="isLoading"
      />
      <StatCard
        type="clearinghouse"
        title="Expiring Clearinghouses"
        :value="stats.expiringClearinghouse"
        :loading="isLoading"
      />
      <StatCard
        type="medical"
        title="Expiring Med Cards"
        :value="stats.expiringMedCards"
        :loading="isLoading"
      />
      <StatCard
        type="applications"
        title="New Applications"
        :value="stats.newApplications"
        :loading="isLoading"
      />
      <StatCard
        type="reviews"
        title="Annual Record Review"
        :value="stats.annualRecordReview"
        :loading="isLoading"
      />
      <StatCard type="audit" title="Audit Score" :value="auditScore" :loading="isLoading" />
    </div>

    <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Priority Alerts Section -->
      <div class="lg:col-span-2">
        <div class="bg-white p-4 rounded-xl shadow h-full">
          <h3 class="font-semibold text-slate-800 flex items-center gap-2">
            <Bell class="w-4 h-4 text-orange-500" />
            Priority Compliance Alerts
          </h3>

          <ul class="mt-3 space-y-2">
            <template v-if="isLoading">
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
                v-for="a in alerts"
                :key="a.id"
                class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div class="flex justify-between items-center">
                  <div class="text-slate-700">{{ a.text }}</div>
                  <div
                    class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors"
                  >
                    {{ a.when }}
                  </div>
                </div>
              </li>
              <li v-if="alerts.length === 0" class="text-slate-500 text-sm italic py-4 text-center">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import StatCard from '@/Components/templates/StatCard.vue'
import AiAssistant from '@/Components/templates/AiAssistant.vue'
import { Bell } from 'lucide-vue-next'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { useCompliance } from '@/Composables/useCompliance'
import type { Driver, Vehicle } from '@/types'

// Real-time data
const appId = import.meta.env.VITE_APP_ID
const { items: drivers, loading: loadingDrivers } = useRealtimeCollection<Driver>(
  `artifacts/${appId}/public/data/drivers`,
)
// Vehicles collection not yet used in dashboard stats logic explicitly but good to have if we expand
const { loading: loadingVehicles } = useRealtimeCollection<Vehicle>(
  `artifacts/${appId}/public/data/vehicles`,
)

const isLoading = computed(() => loadingDrivers.value || loadingVehicles.value)
const { isExpiringSoon, isExpired } = useCompliance()

// Single-pass calculation for all stats
const stats = computed(() => {
  const result = {
    expiringMedCards: 0,
    expiringLicenses: 0,
    expiringClearinghouse: 0,
    newApplications: 0,
    annualRecordReview: 0,
  }

  const thirtyDaysAgo = dayjs().subtract(30, 'day')

  drivers.value.forEach((d) => {
    if (isExpiringSoon(d.medical?.expiryDate)) result.expiringMedCards++
    if (isExpiringSoon(d.cdl?.expiryDate)) result.expiringLicenses++
    if (isExpiringSoon(d.drugAlcohol?.expiryDate)) result.expiringClearinghouse++

    // Check new applications
    if (d.hireDate && dayjs(d.hireDate).isAfter(thirtyDaysAgo)) {
      result.newApplications++
    }

    // Check annual record review (expired MVR)
    if (isExpired(d.mvr?.expiryDate)) {
      result.annualRecordReview++
    }
  })

  return result
})

const auditScore = computed(() => {
  if (drivers.value.length === 0) return '100%'
  const issues =
    stats.value.expiringMedCards +
    stats.value.expiringLicenses +
    stats.value.expiringClearinghouse +
    stats.value.annualRecordReview
  const score = Math.max(0, 100 - issues * 5)
  return `${score}%`
})

// Alerts Logic
const alerts = computed(() => {
  const list: { id: string; text: string; when: string }[] = []

  drivers.value.forEach((d) => {
    // Only check active drivers
    if (d.hireStatus && d.hireStatus !== 'Active') return

    const check = (dateStr: string | undefined, label: string) => {
      if (!dateStr) return

      if (isExpired(dateStr)) {
        list.push({
          id: `${d.id}-${label}`,
          text: `${d.firstName} ${d.lastName}: ${label} expired`,
          when: dateStr,
        })
      } else if (isExpiringSoon(dateStr)) {
        list.push({
          id: `${d.id}-${label}`,
          text: `${d.firstName} ${d.lastName}: ${label} expiring soon`,
          when: dateStr,
        })
      }
    }

    check(d.cdl?.expiryDate, 'CDL')
    check(d.medical?.expiryDate, 'Medical')
    check(d.drugAlcohol?.expiryDate, 'Drug/Alcohol')
    check(d.mvr?.expiryDate, 'MVR')
  })

  return list.sort((a, b) => (dayjs(b.when).unix() - dayjs(a.when).unix()))
})

const alertsCount = computed(() => alerts.value.length)

</script>
