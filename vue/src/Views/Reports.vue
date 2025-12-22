<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-slate-800">Operational Overview</h2>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Total Drivers" :value="totalDrivers">
        <Users />
      </KpiCard>

      <KpiCard title="Active Fleet" :value="`${activeVehicles} / ${totalVehicles}`">
        <Bus />
      </KpiCard>

      <KpiCard title="Compliance Alerts" :value="alerts.length">
        <FileWarning />
      </KpiCard>

      <KpiCard title="Audit Score" value="94%">
        <ShieldCheck />
      </KpiCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Alerts -->
      <div class="lg:col-span-2 bg-white rounded-xl border overflow-hidden">
        <header class="p-4 bg-slate-50 flex justify-between items-center">
          <h3 class="flex items-center gap-2 font-semibold text-slate-700">
            <AlertTriangle  /> Compliance Alerts
          </h3>
          <span class="text-xs px-2 py-1 border rounded">Next 30 Days</span>
        </header>

        <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
          <p v-if="alerts.length === 0" class="text-center text-slate-400 py-8">
            No active alerts. Good job!
          </p>

          <div
            v-for="alert in alerts"
            :key="alert.id"
            :class="alertClass(alert.type)"
            class="p-3 rounded-lg border-l-4 flex justify-between gap-3"
          >
            <div>
              <p class="font-medium text-sm">{{ alert.message }}</p>
              <p class="text-xs opacity-80">Due: {{ alert.dueDate }}</p>
            </div>
            <span class="text-xs font-bold uppercase">{{ alert.type }}</span>
          </div>
        </div>
      </div>

      <!-- AI Assistant -->
      <div class="bg-slate-900 text-white rounded-xl flex flex-col">
        <header class="p-4 border-b border-slate-700 flex gap-2">
          <Bot class="text-blue-400" />
          <h3 class="font-semibold">DOT Regulatory Assistant</h3>
        </header>

        <div class="flex-1 p-4 space-y-4 overflow-y-auto">
          <div v-if="chatResponse" class="bg-slate-700/50 p-3 rounded text-sm">
            <p class="text-blue-300 font-medium">BusCompass AI:</p>
            {{ chatResponse }}
          </div>

          <p v-else class="text-center text-slate-400 text-sm mt-10">
            Ask about HOS, DQF or Vehicle Maintenance.
          </p>

          <div v-if="isThinking" class="text-xs text-blue-300 animate-pulse flex gap-2">
            <Bot  /> Analyzing FMCSA regulations...
          </div>
        </div>

        <footer class="p-4 bg-slate-800 flex gap-2">
          <input
            v-model="chatInput"
            @keydown.enter="handleAskAI"
            placeholder="What is the driving hours limit?"
            class="flex-1 bg-slate-900 border rounded px-3 py-2 text-sm"
          />
          <button
            @click="handleAskAI"
            :disabled="isThinking"
            class="bg-blue-600 px-3 rounded disabled:opacity-50"
          >
            <Send />
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { askRegulatoryAssistant } from '@/services/gemini'
import type { Driver, Vehicle, Alert } from '@/types';
import { Users, Bus, FileWarning, ShieldCheck, AlertTriangle, Bot, Send } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const props = defineProps<{
  drivers: Driver[];
  vehicles: Vehicle[];
}>();

  const chatInput= ref('');
  const chatResponse = ref('');
  const isThinking = ref(false);

  // Calculate KPIs
  const totalDrivers =  computed(() => props.drivers.length);
  const totalVehicles = computed(() => props.vehicles.length);
  const activeVehicles = computed(() => props.vehicles.filter((v: Vehicle) => v.status === 'Active').length);

  // Mock Alert Logic
const alerts = computed<Alert[]>(() => {
  const DAY = 86_400_000
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const parseYMD = (s?: string) => {
    if (!s) return null
    const [y, m, d] = s.split('-').map(Number)
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d) // local midnight
  }

  const list: Alert[] = []

  for (const d of props.drivers) {
    if (d.status !== 'Active') continue

    const check = (dateStr: string | undefined, label: 'CDL' | 'Medical') => {
      const due = parseYMD(dateStr)
      if (!due) return
      const diffDays = Math.floor((due.getTime() - today.getTime()) / DAY)
      if (diffDays < 0) {
        list.push({ id: `${d.id}:${label}`, type: 'critical', message: `${label} expired`, dueDate: dateStr! })
      } else if (diffDays <= 30) {
        list.push({ id: `${d.id}:${label}`, type: 'warning', message: `${label} expiring soon`, dueDate: dateStr! })
      }
    }

    check(d.cdl?.expiryDate, 'CDL')
    check(d.medical?.expiryDate, 'Medical')
  }

  return list
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

const handleAskAI = async () => {
  if (!chatInput.value.trim()) return
  isThinking.value = true
  chatResponse.value = ''
  const answer = await askRegulatoryAssistant(chatInput.value)
  chatResponse.value = answer
  isThinking.value = false
}

</script>
