<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 lg:grid-cols-7 gap-3">
      <StatCard title="Inspections Due" :value="alertsCount" :icon="Users" />
      <StatCard title="Expiring Clearinghouses" :value="totalDrivers" />
      <StatCard title="Expiring Med Cards" :value="expiringMedCards" />
      <StatCard title="Alerts" :value="alertsCount" />
      <StatCard title="Audit Score" :value="auditScore" />
      <StatCard title="New Applications" :value="newApplications" />
      <StatCard title="Annual Record Review" :value="annualRecordReview" />

    </div>

    <div class="mt-3 grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="col-span-2">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold text-slate-800">Priority Compliance Alerts</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="a in alerts" :key="a.id" class="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <div class="flex justify-between items-center">
                <div class="text-slate-700">{{ a.text }}</div>
                <div class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{{ a.when }}</div>
              </div>
            </li>
            <li v-if="alerts.length === 0" class="text-slate-500 text-sm italic">
              No critical compliance issues found. Take a water break!
            </li>
          </ul>
        </div>
      </div>


        <div class=" w-100 h-100 rounded shadow">
          <AiAssistant/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StatCard from './StatCard.vue'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import  AiAssistant from './AiAssistant.vue'
import { Users } from 'lucide-vue-next'

interface Alert {
  id: string
  text: string
  when: string
}

// State
const totalDrivers = ref<number>(0)
const expiringMedCards = ref<number>(0)
const newApplications = ref<number>(0)
const annualRecordReview = ref<number>(0)
// const totalVehicles = ref<number>(0)
const alerts = ref<Alert[]>([])
const alertsCount = computed(() => alerts.value.length)
const auditScore = ref<string>('—')

const iaQuery = ref<string>('')
const iaAnswer = ref<string>('')
const loadingIa = ref<boolean>(false)

// Actions
async function loadCounts() {
  try {
    const driverSnap = await getDocs(collection(db, 'artifacts/app/public/data/drivers'))
    totalDrivers.value = driverSnap.size

    // const vSnap = await getDocs(collection(db, 'artifacts/app/public/data/vehicles'))
    // totalVehicles.value = vSnap.size

    // Simulate alerts based on data or random for now
    if (totalDrivers.value > 0) {
      alerts.value = [
        { id: '1', text: 'Driver John Doe: License expiring', when: 'In 5 days' },
        { id: '2', text: 'Vehicle 104: Annual Inspection due', when: 'Tomorrow' }
      ]
    }
  } catch (error) {
    console.error("Error loading dashboard counts:", error)
  }
}


onMounted(async () => {
  await loadCounts()
})
</script>
