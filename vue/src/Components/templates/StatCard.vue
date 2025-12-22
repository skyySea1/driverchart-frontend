<!-- src/Components/templates/StatCard.vue -->
<template>
  <div class="bg-white p-4 rounded shadow min-h-22 flex flex-col justify-center">
    <div v-if="loading" class="animate-pulse space-y-2">
      <div class="h-3 bg-slate-200 rounded w-2/3"></div>
      <div class="h-6 bg-slate-200 rounded w-1/2"></div>
    </div>
    <div v-else class="flex items-center justify-between">
      <div>
        <div class="text-sm text-slate-400 truncate">{{ title }}</div>
        <div class="text-2xl font-bold">{{ value }}</div>
      </div>
      <component v-if="icon" :is="icon" class="w-8 h-8 text-slate-400 shrink-0 ml-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  icon?: Component
  loading?: boolean
}>()
</script>
