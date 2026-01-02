<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- SVG Background main pulsing circle -->
    <svg
      class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none animate-pulse-slow"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50%" cy="50%" r="500" fill="url(#grad)" />
    </svg>

    <!-- Central pulsing circle (global styles) -->
    <div class="circle-container">
      <div class="circle-glow animate-pulse-glow">
        <div class="circle-inner"></div>
      </div>
    </div>

    <div
      class="relative z-10 w-full max-w-4xl rounded-xl bg-slate-900 p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
    >
      <div class="flex flex-col gap-6">
        <div class="text-6xl md:text-7xl font-black tracking-tight text-indigo-300 leading-none">404</div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Page Not Found</h1>
        <p class="text-slate-300 leading-relaxed">
          Sorry, the page you are looking for does not exist or has been removed.
        </p>

        <div class="bg-slate-800 rounded-lg p-4 border-l-4 border-indigo-500">
          <div class="text-sm text-slate-200">
            <span class="font-semibold text-white">Current Route:</span>
          </div>
          <code class="mt-2 block rounded bg-slate-900 px-3 py-2 text-sm text-indigo-200 font-mono break-all">
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
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { ArrowLeft, Home } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.fullPath)

const goBack = () => {
  router.back()
}
</script>
