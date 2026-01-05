<!-- src/Views/DashboardView.vue -->
<template>
  <div class="space-y-6">

    <!-- Top StatsCard Bar -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      <StatCard
        type="alerts"
        title="Alerts"
        :value="stats?.alertsCount ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
      <StatCard
        type="licenses"
        title="Expiring Licenses"
        :value="stats?.expiringLicenses ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?status=expiring')"
      />
      <StatCard
        type="clearinghouse"
        title="Expiring Clearinghouses"
        :value="stats?.expiringClearinghouse ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?status=expiring')"
      />
      <StatCard
        type="medical"
        title="Expiring Med Cards"
        :value="stats?.expiringMedCards ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/drivers?status=expiring')"
      />
      <StatCard
        type="applications"
        title="New Applications"
        :value="stats?.newApplications ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/applications')"
      />
      <StatCard
        type="reviews"
        title="Annual MVR Review"
        :value="stats?.annualRecordReview ?? 0"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
      <StatCard
        type="audit"
        title="Audit Score"
        :value="stats?.auditScore ?? '0%'"
        :loading="isLoading"
        is-clickable
        @click="router.push('/audit')"
      />
    </div>

    <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Priority Alerts Section -->
      <div class="lg:col-span-2">
        <ComplianceAlerts title="Priority Compliance Alerts" :icon="Bell" />
      </div>

      <!-- AI Assistant Section -->
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
import { Bell } from 'lucide-vue-next'
import { useDashboard } from '@/Composables/useDashboard'

const router = useRouter()
const { stats, isLoading } = useDashboard()
</script>
