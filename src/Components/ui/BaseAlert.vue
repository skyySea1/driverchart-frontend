<template>
  <transition
    enter-active-class="animate-in fade-in slide-in-from-top-2 duration-200"
    leave-active-class="animate-out fade-out slide-out-to-top-2 duration-200"
  >
    <div
      v-if="visible"
      :class="['flex items-start gap-3 p-4 rounded-lg border', variantClasses]"
      role="alert"
    >
      <div class="shrink-0 mt-0.5">
        <component :is="icon" :class="['w-5 h-5', iconColor]" />
      </div>
      <div class="flex-1">
        <h3 v-if="title" :class="['font-semibold text-sm', titleColor]">
          {{ title }}
        </h3>
        <p :class="['text-sm', messageColor, title ? 'mt-1' : '']">
          {{ message }}
        </p>
      </div>
      <button
        v-cursor
        v-if="closeable"
        @click="visible = false"
        :class="['shrink-0', closeButtonColor]"
        aria-label="Close alert"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'

export type AlertType = 'error' | 'success' | 'warning' | 'info'

const {
  type = 'info',
  title,
  message,
  closeable = true,
} = defineProps<{
  type?: AlertType
  title?: string
  message: string
  closeable?: boolean
}>()

const visible = ref(true)

const iconMapper = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const icon = computed(() => iconMapper[type])

const variantClasses = computed(() => {
  const variants = {
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return variants[type]
})

const titleColor = computed(() => {
  const colors = {
    error: 'text-red-900',
    success: 'text-green-900',
    warning: 'text-amber-900',
    info: 'text-blue-900',
  }
  return colors[type]
})

const messageColor = computed(() => {
  const colors = {
    error: 'text-red-700',
    success: 'text-green-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
  }
  return colors[type]
})

const iconColor = computed(() => {
  const colors = {
    error: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  }
  return colors[type]
})

const closeButtonColor = computed(() => {
  const colors = {
    error: 'text-red-500 hover:text-red-700',
    success: 'text-green-500 hover:text-green-700',
    warning: 'text-amber-500 hover:text-amber-700',
    info: 'text-blue-500 hover:text-blue-700',
  }
  return colors[type]
})
</script>
