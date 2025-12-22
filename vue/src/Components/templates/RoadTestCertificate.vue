
<template>
  <div class="p-6 bg-white text-black" style="width:800px">
    <h2 class="text-lg font-bold">Certificate of Driver's Road Test</h2>
    <p class="mt-2">(Template simplified — based on DOT 49 CFR 391.31)</p>
    <div class="mt-4" v-if="driver">
      <div><strong>Driver:</strong> {{ driver.firstName }} {{ driver.lastName }}</div>
      <div><strong>Examiner:</strong> {{ driver.roadTest?.examiner || driver.roadTestExaminer }}</div>
      <div><strong>Date:</strong> {{ driver.roadTest?.date || driver.roadTestDate }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  driver: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})
</script>
