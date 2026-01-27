<template>
  <RouterLink
    v-if="to"
    :to="to"
    @click="$emit('click')"
    class="btn-up-hover-effect px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 cursor-pointer"
    :class="[variantClasses, { 'opacity-70 pointer-events-none': loading }]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <component v-else-if="icon" :is="icon" class="w-4 h-4 pointer-events-none" />
    {{ label }}
  </RouterLink>

  <button
    v-else
    :type="type"
    @click="$emit('click')"
    :disabled="loading"
    class="btn-up-hover-effect px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-70 disabled:pointer-events-none disabled:cursor-not-allowed"
    :class="variantClasses"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <component v-else-if="icon" :is="icon" class="w-4 h-4 pointer-events-none" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Icon } from 'lucide-vue-next'
import { Plus, Loader2 } from 'lucide-vue-next'

function getVariantClasses(variant: string) {
  switch (variant) {
    case 'primary':
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    case 'secondary':
      return 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500'
    case 'blue':
      return 'bg-blue-500 hover:bg-blue-700 focus:ring-sky-400'
    case 'success':
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'outline':
      return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-400'
    default:
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
  }
}

const {
  label,
  to,
  icon = Plus,
  variant = 'primary',
  loading = false,
  type = 'button',
} = defineProps<{
  label: string
  to?: string
  icon?: Icon
  variant?: 'primary' | 'secondary' | 'blue' | 'success' | 'warning' | 'danger' | 'outline'
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()

// additional classes based on variant
const variantClasses = computed(() => getVariantClasses(variant))
// when variants grow more consider using a mapping object instead, or composable

defineEmits<{
  (e: 'click'): void
}>()
</script>
