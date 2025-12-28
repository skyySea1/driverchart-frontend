<!-- src/Views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <!-- Top Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <StatCard type="alerts" title="Alerts" :value="alertsCount" :loading="isLoading" />
      <StatCard
        type="licenses"
        title="Expiring Licenses"
        :value="expiringLicenses"
        :loading="isLoading"
      />
      <StatCard
        type="clearinghouse"
        title="Expiring Clearinghouses"
        :value="expiringClearinghouse"
        :loading="isLoading"
      />
      <StatCard
        type="medical"
        title="Expiring Med Cards"
        :value="expiringMedCards"
        :loading="isLoading"
      />
      <StatCard
        type="applications"
        title="New Applications"
        :value="newApplications"
        :loading="isLoading"
      />
      <StatCard
        type="reviews"
        title="Annual Record Review"
        :value="annualRecordReview"
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
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/Components/templates/StatCard.vue'
import { dataService } from '@/services/dataService'
import AiAssistant from '@/Components/templates/AiAssistant.vue'
import { Bell } from 'lucide-vue-next'
import type { Alert } from '@/types'

// State
const isLoading = ref(true)
const expiringMedCards = ref<number>(0)
const expiringLicenses = ref<number>(0)
const expiringClearinghouse = ref<number>(0)
const newApplications = ref<number>(0)
const annualRecordReview = ref<number>(0)
const alerts = ref<{ id: string; text: string; when: string }[]>([])
const alertsCount = computed(() => alerts.value.length)
const auditScore = ref<string>('94%')

// Actions
async function loadCounts() {
  isLoading.value = true
  try {
    const stats = await dataService.getDashboardStats()
    expiringMedCards.value = stats.expiringMedCards
    expiringLicenses.value = stats.expiringLicenses
    expiringClearinghouse.value = stats.expiringClearinghouse
    newApplications.value = stats.newApplications
    annualRecordReview.value = stats.annualRecordReview
    alerts.value = (stats.alerts as Alert[]).map((a: Alert) => ({
      id: a.id,
      text: `${a.entity || 'Driver'}: ${a.message}`,
      when: a.dueDate,
    }))
    auditScore.value = stats.auditScore
  } catch (error) {
    console.error('Error loading dashboard counts:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadCounts()
})
</script>
