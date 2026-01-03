<script setup lang="ts">
defineProps<{
  ok?: boolean
  neutral?: boolean
}>()
</script>

<template>
  <div
    class="w-3 h-3 rounded-full mx-auto"
    :class="
      neutral
        ? ok ? 'bg-green-500' : 'bg-gray-300'
        : ok ? 'bg-green-500' : 'bg-red-500'
    "
  ></div>
</template>
