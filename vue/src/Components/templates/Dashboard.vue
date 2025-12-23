<!-- src/Components/templates/Dashboard.vue -->
<template>
  <div class="space-y-6">
        <!-- Top Stats Bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard
            title="Inspections Due"
            :value="alertsCount"
            :icon="ShieldAlert"
            :loading="isLoading"
            color="rose"
          />
          <StatCard
            title="Drivers"
            :value="totalDrivers"
            :icon="Users"
            :loading="isLoading"
            color="indigo"
          />
          <StatCard
            title=" Expiring Med Cards"
            :value="expiringMedCards"
            :icon="Stethoscope"
            :loading="isLoading"
            color="orange"
          />
          <StatCard
            title="Expiring Clearinghouses"
            :value="alertsCount"
            :icon="CalendarCheck"
            :loading="isLoading"
            color="amber"
          />
          <StatCard
            title="Audit Score"
            :value="auditScore"
            :icon="FileCheck"
            :loading="isLoading"
            color="emerald"
          />
          <StatCard
            title="New Applications"
            :value="newApplications"
            :icon="FileText"
            :loading="isLoading"
            color="purple"

          />
          <StatCard
            title="Annual Record Reviews"
            :value="annualRecordReview"
            :icon="ClipboardList"
            :loading="isLoading"
            color="blue"
          />:        </div>
    <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Priority Alerts Section -->
      <div class="lg:col-span-2">
        <div class="bg-white p-4 rounded shadow h-full">
          <h3 class="font-semibold border-b border-slate-200 text-slate-800 flex items-center gap-2">
            <Bell class="w-4 h-4 text-orange-500" />
            Priority Compliance Alerts
          </h3>

          <ul class="mt-3 space-y-2">
            <template v-if="isLoading">
              <li v-for="i in 3" :key="i" class="p-3 border border-slate-100 rounded animate-pulse flex justify-between">
                <div class="h-4 bg-slate-100 rounded w-1/2"></div>
                <div class="h-4 bg-slate-50 rounded w-1/4"></div>
              </li>
            </template>
            <template v-else>
              <li v-for="a in alerts" :key="a.id" class="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors group">
                <div class="flex justify-between items-center">
                  <div class="text-slate-700 font-medium">{{ a.text }}</div>
                  <div class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
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
import StatCard from './StatCard.vue'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import AiAssistant from './AiAssistant.vue'
import {
  Users,
  ShieldAlert,
  Stethoscope,
  Calendar,
  Bell,
  FileCheck,
  FileText,
  ClipboardList
} from 'lucide-vue-next'
import { CalendarCheck } from 'lucide-vue-next'

interface Alert {
  id: string
  text: string
  when: string
}

// State
const isLoading = ref(true)
const totalDrivers = ref<number>(0)
const expiringMedCards = ref<number>(0)
const newApplications = ref<number>(0)
const annualRecordReview = ref<number>(0)
const alerts = ref<Alert[]>([])
const alertsCount = computed(() => alerts.value.length)
const auditScore = ref<string>('94%') // Mocked for now

// Actions
async function loadCounts() {
  isLoading.value = true
  try {
    const driverSnap = await getDocs(collection(db, 'artifacts/app/public/data/drivers'))
    totalDrivers.value = driverSnap.size

    // Simulate more realistic loading and mock data
    if (totalDrivers.value > 0) {
      alerts.value = [
        { id: '1', text: 'Driver John Doe: License expiring', when: 'In 5 days' },
        { id: '2', text: 'Vehicle 104: Annual Inspection due', when: 'Tomorrow' }
      ]
      expiringMedCards.value = 2
      newApplications.value = 5
      annualRecordReview.value = 1
    }
  } catch (error) {
    console.error("Error loading dashboard counts:", error)
  } finally {
    // Artificial delay to show skeleton if it's too fast
    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }
}

onMounted(async () => {
  await loadCounts()
})
</script>
