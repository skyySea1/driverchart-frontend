
<template>
  <div class="p-6 bg-white text-black" style="width:800px">
    <h2 class="text-lg font-bold">Certificate of Driver's Road Test</h2>
    <p class="mt-2">(Template simplified — based on DOT 49 CFR 391.31)</p>
    <div class="mt-4">
      <div><strong>Driver:</strong> {{ driver.firstName }} {{ driver.lastName }}</div>
      <div><strong>Examiner:</strong> {{ driver.roadTestExaminer }}</div>
      <div><strong>Date:</strong> {{ driver.roadTestDate }}</div>
    </div>
    <div class="mt-6">
      <p>Certification: The driver successfully completed the road test per DOT requirements.</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ driver: Object })
</script>
