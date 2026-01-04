<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">

    <!-- SVG pulsing Background -->
    <svg class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none animate-pulse-slow"
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50%" cy="50%" r="500" fill="url(#grad)" />
    </svg>
    <!-- Central pulsing circle with glassmorphism effect -->
    <div class="circle-container">
      <div class="circle-glow animate-pulse-glow">
        <div class="circle-inner"></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

