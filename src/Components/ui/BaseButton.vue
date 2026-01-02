<template>
  <RouterLink
    v-if="to"
    :to="to"
    @click="$emit('click')"
    class="btn-up-hover-effect px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 cursor-pointer"
    :class="variantClasses"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 pointer-events-none" />
    {{ label }}
  </RouterLink>

  <button
    v-else
    type="button"
    @click="$emit('click')"
    class="btn-up-hover-effect px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 cursor-pointer"
    :class="variantClasses"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 pointer-events-none" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Icon } from 'lucide-vue-next'
import { Plus } from 'lucide-vue-next'

function getVariantClasses(variant: string) {
  switch (variant) {
    case 'primary':
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    case 'secondary':
      return 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500'
    default:
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
  }
}

const { label, to, icon = Plus, variant = 'primary' } = defineProps<{
  label: string
  to?: string
  icon?: Icon
  variant?: 'primary' | 'secondary'
}>()

// additional classes based on variant
const variantClasses = computed(() => getVariantClasses(variant))
// when variants grow more consider using a mapping object instead, or composable

defineEmits<{
  (e: 'click'): void
}>()
</script>
