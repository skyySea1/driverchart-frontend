<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { initAuth } from './services/firebase'

onMounted(async () => {
  await initAuth()
})
</script>
