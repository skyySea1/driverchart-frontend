<!-- src/Components/templates/StatCard.vue -->
<template>
  <div
    @click="$emit('click')"
    :class="[
      'bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-27.5 flex items-center gap-4 relative',
      isClickable ? 'cursor-pointer hover:border-blue-300' : ''
    ]"
  >
    <!-- Skeleton State -->
    <div v-if="props.loading" class="flex items-center gap-4 w-full h-full">
      <div class="w-12 h-12 rounded-lg shrink-0 skeleton"></div>
      <div class="space-y-2 flex-1">
        <div class="h-3 rounded w-1/2 skeleton"></div>
        <div class="h-6 rounded w-1/3 skeleton"></div>
      </div>
    </div>

    <!-- Data State -->
    <template v-else>
      <div
        v-if="config.icon"
        :class="['p-3 rounded-lg shrink-0 transition-colors', config.bgClass, config.iconClass]"
      >
        <component :is="config.icon" class="w-6 h-6" />
      </div>

      <div class="min-w-0 flex-1 py-1">
        <div
          class="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight mb-1"
        >
          {{ props.title }}
        </div>
        <div class="text-xl font-black text-slate-800 leading-none">
          {{ props.value }}
        </div>
      </div>

      <!-- Auto-configured Badge -->
      <div v-if="config.badgeText" class="absolute bottom-2 right-4">
        <BaseBadge :variant="config.badgeVariant">
          {{ config.badgeText }}
        </BaseBadge>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed} from 'vue'
import BaseBadge from '@/Components/ui/BaseBadge.vue'
import type { StatConfig, CardType } from '@/types'
import {
  Users,
  ShieldAlert,
  Stethoscope,
  Bell,
  FileCheck,
  FileText,
  ClipboardList,
  Bus,
  Activity,
  AlertOctagon,
} from 'lucide-vue-next'

const props = defineProps<{
  type: CardType
  title: string
  value?: string | number
  loading?: boolean
  isClickable?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

// Internal mapping configuration
const config = computed(() => {
  const mappings: Record<CardType, StatConfig> = {
    // --- DASHBOARD ORIGINAL TYPES ---
    inspections: {
      icon: ShieldAlert,
      bgClass: 'bg-rose-50',
      iconClass: 'text-rose-600',
      badgeText: 'Within 30d',
      badgeVariant: 'destructive',
    },
    licenses: {
      icon: AlertOctagon,
      bgClass: 'bg-red-50',
      iconClass: 'text-red-600',
      badgeText: 'Within 30d',
      badgeVariant: 'destructive',
    },
    clearinghouse: {
      icon: ShieldAlert,
      bgClass: 'bg-green-50',
      iconClass: 'text-green-600',
      badgeText: 'Within 30d',
      badgeVariant: 'green',
    },
    drivers: {
      icon: Users,
      bgClass: 'bg-indigo-50',
      iconClass: 'text-indigo-600',
      badgeText: null,
      badgeVariant: 'secondary',
    },
    medical: {
      icon: Stethoscope,
      bgClass: 'bg-orange-50',
      iconClass: 'text-orange-600',
      badgeText: 'Within 30d',
      badgeVariant: 'warning',
    },
    alerts: {
      icon: Bell,
      bgClass: 'bg-amber-50',
      iconClass: 'text-amber-600',
      badgeText: Number(props.value) > 0 ? 'Urgent' : null,
      badgeVariant: 'destructive',
    },
    audit: {
      icon: FileCheck,
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-600',
      badgeText: 'Live Score',
      badgeVariant: 'success',
    },
    applications: {
      icon: FileText,
      bgClass: 'bg-purple-50',
      iconClass: 'text-purple-600',
      badgeText: Number(props.value) > 0 ? 'Pending' : null,
      badgeVariant: 'purple',
    },
    reviews: {
      icon: ClipboardList,
      bgClass: 'bg-blue-50',
      iconClass: 'text-blue-600',
      badgeText: 'Annual',
      badgeVariant: 'outline',
    },
    fleet: {
      icon: Bus,
      bgClass: 'bg-slate-100',
      iconClass: 'text-slate-600',
      badgeText: 'Registered',
      badgeVariant: 'secondary',
    },
    active_fleet: {
      icon: Activity,
      bgClass: 'bg-cyan-50',
      iconClass: 'text-cyan-600',
      badgeText: 'On Road',
      badgeVariant: 'success',
    },
  }

  return mappings[props.type] || mappings['drivers']
})
</script>
