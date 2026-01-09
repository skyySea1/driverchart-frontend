<template>
  <button
    v-cursor
    type="button"
    :title="title"
    :class="[
      'p-1 rounded transition-all border',
      computedClasses
    ]"
    @click="$emit('click')"
    :disabled="status === 'loading'"
  >
    <component
      :is="computedIcon"
      class="w-3.5 h-3.5"
      :class="{ 'animate-spin': status === 'loading' }"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Check, Loader2, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  icon: Component
  title?: string
  variant?: 'default' | 'primary' | 'danger'
  status?: 'idle' | 'loading' | 'success' | 'error'
}>(), {
  title: '',
  variant: 'default',
  status: 'idle'
})

defineEmits<{ (e: 'click'): void }>()

const computedIcon = computed(() => {
  if (props.status === 'success') return Check
  if (props.status === 'loading') return Loader2
  if (props.status === 'error') return X
  return props.icon
})

const computedClasses = computed(() => {
  // Success override
  if (props.status === 'success') {
    return 'bg-white border-indigo-500 text-indigo-600 hover:bg-indigo-50 shadow-sm'
  }

  // Base variants
  const base = 'border-transparent'
  switch (props.variant) {
    case 'primary':
      return `${base} bg-blue-50 text-blue-600 hover:bg-blue-100`
    case 'danger':
      return `${base} bg-red-50 text-red-600 hover:bg-red-100`
    default:
      return `${base} bg-slate-200 text-slate-600 hover:bg-slate-300`
  }
})
</script>
