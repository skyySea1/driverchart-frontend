<!-- vuebus/src/Components/templates/ComplianceAlerts.vue -->
<template>
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full">
    <header class="p-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
      <h3 class="flex items-center gap-2 font-semibold text-slate-700">
        <component :is="icon" class="w-4 h-4 text-amber-500" /> {{title}}
      </h3>
     <slot></slot>
    </header>

    <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
      <template v-if="isLoading && !alerts.length">
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
          @click="navigateToDriver(alert)"
          class="p-3 rounded-lg border-l-4 flex justify-between items-center gap-3 transition-all hover:translate-x-1 cursor-pointer"
        >
          <div>
            <p class="font-bold text-sm">
              <span class="text-indigo-600 hover:underline">
                {{ capitalizeName( alert.entity || 'Driver') }}
              </span>: {{ alert.message }}
            </p>
            <p class="text-xs opacity-80">Due: {{ formatDate(alert.dueDate) }}</p>
          </div>
          <span class="text-[10px] font-black uppercase tracking-tighter">{{ alert.type }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, type Icon } from 'lucide-vue-next';
import { useDashboard } from '@/Composables/useDashboard'
import dayjs from 'dayjs'
import type { Alert } from '@/types'
import { capitalizeName } from '@/utils/utils'

const router = useRouter()
const { stats, isLoading } = useDashboard()

const { title = 'Compliance Alerts', icon = AlertTriangle } = defineProps<{
  title?: string
  icon?: Icon
}>()

const alerts = computed(() => {
  return stats.value?.alerts || []
})

const formatDate = (date?: string) => {
  if (!date) return '-'
  return dayjs(date).format('MM/DD/YYYY')
}
// move to helpers util
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

const navigateToDriver = (alert: Alert) => {
  const driverName = alert.entityName || alert.entity
  if (driverName) {
    router.push({
      path: '/drivers',
      query: { search: driverName }
    })
  }
}
</script>
