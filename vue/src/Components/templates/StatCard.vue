<template>
  <div class="bg-white p-4 rounded shadow">
    <div class="text-sm text-slate-400">{{ title }}</div>
    <div class="text-2xl font-bold">{{ value }}</div>
  </div>
</template>
<script setup lang="ts">const props = defineProps({ title: String, value: [String,Number] })
</script>
