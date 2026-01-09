<template>
  <button class="rounded transition-colors cursor-pointer">
    <component :is="icon" class="w-4 h-4" />
  </button>
</template>

<script setup lang="ts">
import type { Icon } from 'lucide-vue-next'

defineProps<{
  icon: Icon
}>()
</script>
