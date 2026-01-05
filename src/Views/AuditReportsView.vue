<!-- src/Views/AuditReportsView.vue -->
<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-slate-800">Operational Overview</h2>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        type="drivers"
        title="Total Drivers"
        :value="stats?.totalDrivers ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers')"
      />
      <StatCard
        type="inspections"
        title="Active Fleet"
        :value="`${stats?.totalVehicles ?? 0}`"
        is-clickable
        @click="router.push('/vehicles')"
        :loading="isLoading"
      />
      <StatCard
        type="alerts"
        title="Compliance Alerts"
        :value="stats?.alertsCount ?? 0"
        :loading="isLoading"
      />
      <StatCard
        type="audit"
        title="Audit Score"
        :value="stats?.auditScore ?? '0%'"
        :loading="isLoading"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Alerts Component -->
      <div class="lg:col-span-2">
        <ComplianceAlerts title="Compliance Alerts" :icon="AlertTriangle">
           <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded">
        Next 30 Days
      </span>
        </ComplianceAlerts>
      </div>

      <!-- AI Assistant -->
      <div class="rounded shadow bg-white overflow-hidden min-h-75">
        <AiAssistant />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import StatCard from '@/Components/templates/StatCard.vue'
import AiAssistant from '@/Components/templates/AiAssistant.vue'
import ComplianceAlerts from '@/Components/templates/ComplianceAlerts.vue'
import { useDashboard } from '@/Composables/useDashboard'
import { AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const { stats, isLoading } = useDashboard()
</script>
