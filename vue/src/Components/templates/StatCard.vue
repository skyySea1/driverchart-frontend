<!-- src/Components/templates/StatCard.vue -->
<template>
  <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 min-h-25 flex items-center gap-4">
    <!-- Skeleton State -->
    <div v-if="loading" class="animate-pulse flex items-center gap-4 w-full">
      <div class="w-12 h-12 bg-slate-100 rounded-lg shrink-0"></div>
      <div class="space-y-2 flex-1">
        <div class="h-3 bg-slate-100 rounded w-1/2"></div>
        <div class="h-6 bg-slate-100 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Data State -->
    <template v-else>
      <div
        v-if="icon"
        :class="[
          'p-3 rounded-lg shrink-0 transition-colors',
          colorClasses[color || 'indigo'].bg,
          colorClasses[color || 'indigo'].text
        ]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-0.5">
          {{ title }}
        </div>
        <div class="text-1xl font-black text-slate-800 leading-tight">
          {{ value }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  title: string
  value?: string | number
  icon?: Component
  loading?: boolean
  color?: 'indigo' | 'orange' | 'emerald' | 'rose' | 'amber' | 'purple' | 'blue'
}>()

const colorClasses = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
}
</script>
