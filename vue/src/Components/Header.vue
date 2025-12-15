<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <button class="sm:hidden p-2 rounded bg-slate-100" @click="$emit('open-mobile')">☰</button>
<div>
  <h1 class="text-2xl font-bold text-slate-900">Safety &amp; Compliance Overview</h1>
  <p class="text-slate-500 text-sm mt-1">US DOT #1234567 | FMCSA Passenger Carrier</p>
</div>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-sm text-slate-500">Signed-in (test)</div>
    </div>
  </header>
</template>

<script setup></script>
