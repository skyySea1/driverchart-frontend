<template>
  <div class="bg-white p-4 rounded shadow">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-slate-400">{{ title }}</div>
        <div class="text-2xl font-bold">{{ value }}</div>
      </div>
      <component v-if="icon" :is="icon" class="w-8 h-8 text-slate-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
  
import type { Component } from 'vue'

// icon are passed as components by props
const { title, value, icon } = defineProps<{
  title: string
  value: string | number
  icon?: Component
}>()
</script>
