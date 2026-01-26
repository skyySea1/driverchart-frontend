<template>
  <AnimatedBody>
    <div
      class="relative z-10 w-full max-w-4xl rounded-xl bg-slate-900 p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
    >
      <div class="flex flex-col gap-6">
        <div class="text-6xl md:text-7xl font-black tracking-tight text-indigo-300 leading-none">
          {{ errorCode }}
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">{{ errorInfo.title }}</h1>
        <p class="text-slate-300 leading-relaxed">{{ errorInfo.message }}</p>

        <div class="bg-slate-800 rounded-lg p-4 border-l-4 border-indigo-500">
          <div class="text-sm text-slate-200">
            <span class="font-semibold text-white">Current Route:</span>
          </div>
          <code
            class="mt-2 block rounded bg-slate-900 px-3 py-2 text-sm text-indigo-200 font-mono break-all"
          >
            {{ currentRoute }}
          </code>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 font-bold">
          <BaseButton :to="'/'" label="Back to Home" :icon="Home" />
          <BaseButton variant="secondary" label="Go Back" :icon="ArrowLeft" @click="goBack" />
        </div>
      </div>

      <div class="w-full flex items-center justify-center">
        <svg
          class="max-w-62.5 w-full h-auto animate-[float_3s_ease-in-out_infinite]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="text-indigo-600"
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          />
          <text
            class="text-slate-500"
            x="100"
            y="120"
            text-anchor="middle"
            font-size="60"
            font-weight="bold"
            fill="currentColor"
          >
            ?
          </text>
        </svg>
      </div>
    </div>
  </AnimatedBody>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { ArrowLeft, Home } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import AnimatedBody from '@/Components/ui/AnimatedBody.vue'

const router = useRouter()
const route = useRoute()
const props = defineProps<{
  code?: number
}>()

const currentRoute = computed(() => route.fullPath)

const errorCode = computed(() => {
  if (props.code) return props.code
  if (route.query.code) return Number(route.query.code)
  return 404
})

const errorInfo = computed(() => {
  return erroritems[errorCode.value as keyof typeof erroritems] || erroritems[404]
})

// create personalized image or animation for each error code
const erroritems = {
  400: {
    title: 'Sorry, something went wrong.',
    message: 'Bad Request',
  },
  401: {
    title: 'Unauthorized Access',
    message: 'You do not have permission to view this page.',
  },
  403: {
    title: 'Access Denied',
    message: 'You do not have permission to view this page.',
  },
  404: {
    title: 'Page Not Found',
    message: 'Sorry, the page you are looking for does not exist or has been removed.',
  },
  500: {
    title: 'Server Error',
    message: 'Internal Server Error. Please try again later.',
  },
  502: {
    title: 'Connection Error',
    message: 'Bad Gateway',
  },
  503: {
    title: 'Unavailable',
    message: 'Service Unavailable',
  },
  504: {
    title: 'Timeout',
    message: 'Gateway Timeout',
  },
}

const goBack = () => {
  router.back()
}
</script>
