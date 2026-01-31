<!-- src/Components/ui/BaseBadge.vue -->
<template>
  <div
    :class="[
      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variantClasses[props.variant || 'default'],
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { BadgeVariant } from '@/types'

const props = defineProps<{
  variant?: BadgeVariant
}>()

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80',
  secondary: 'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-300',
  blue: 'border-transparent bg-indigo-600 text-slate-50 shadow hover:bg-blue-500/80',
  destructive: 'border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80',
  success: 'border-transparent bg-emerald-500 text-slate-50 shadow hover:bg-emerald-500/80',
  warning: 'border-transparent bg-amber-500 text-slate-50 shadow hover:bg-amber-500/80',
  purple: 'border-transparent bg-purple-500 text-slate-50 shadow hover:bg-purple-500/80',
  outline: 'text-slate-950 border-slate-200',
  green: 'border-transparent bg-green-500 text-slate-50 shadow hover:bg-green-500/80',
}
</script>
