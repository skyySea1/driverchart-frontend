<template>
  <div class="font-serif text-black p-8 border-2 border-slate-800 print:border-none">
    <div class="text-center mb-8 border-b-2 border-black pb-4">
      <h2 class="text-2xl font-bold uppercase tracking-widest">
        Certificate of Driver's Road Test
      </h2>
      <p class="text-xs italic">
        Instructions: If the road test is successfully completed, the person who gave it shall
        complete a certificate of the driver's road test.
      </p>
      <p class="text-xs font-bold mt-1">Reference: 49 CFR 391.31(e)(f)(g)</p>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label class="font-bold block text-sm">Driver's Name</label>
          <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono text-lg">
            {{ fullName }}
          </div>
        </div>
        <div>
          <label class="font-bold block text-sm">Social Security No.</label>
          <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono text-lg">
            {{ driver.ssn }}
          </div>
        </div>
        <div>
          <label class="font-bold block text-sm">Driver's License No.</label>
          <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono text-lg">
            {{ driver.cdl?.documentNumber }}
          </div>
        </div>
        <div>
          <label class="font-bold block text-sm">State</label>
          <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono text-lg">
            {{ driver.cdl?.state }}
          </div>
        </div>
      </div>

      <div class="pt-4">
        <label class="font-bold block text-sm">Type of Power Unit (Bus/Truck)</label>
        <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono">
          Motorcoach / Passenger Bus
        </div>
      </div>
      <div>
        <label class="font-bold block text-sm">Type of Trailer(s)</label>
        <div class="border-b border-black h-8 pt-1 text-blue-800 font-mono">N/A</div>
      </div>

      <div class="py-6 text-justify leading-relaxed">
        <p>
          This is to certify that the above-named driver was given a road test under my supervision
          on
          <span
            class="inline-block border-b border-black w-32 mx-2 text-center text-blue-800 font-mono"
            >{{ driver.roadTest?.date }}</span
          >, consisting of approximately
          <span class="inline-block border-b border-black w-20 mx-2 text-center"></span>
          miles of driving.
        </p>
        <p class="mt-4">
          It is my considered opinion that this driver possesses sufficient driving skill to operate
          safely the type of commercial motor vehicle listed above.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-12 mt-12">
        <div>
          <label class="font-bold block text-sm">Signature of Examiner</label>
          <div class="border-b border-black h-8 mt-4"></div>
          <p class="text-xs text-blue-800 mt-1 font-mono">{{ driver.roadTest?.examiner }}</p>
        </div>
        <div>
          <label class="font-bold block text-sm">Title</label>
          <div class="border-b border-black h-8 mt-4 text-blue-800 font-mono">Safety Director</div>
        </div>
      </div>

      <div class="mt-4">
        <label class="font-bold block text-sm">Organization and Address of Examiner</label>
        <div class="border-b border-black h-8 mt-4 text-blue-800 font-mono">
          CharterSafe Bus Company
        </div>
        <div class="border-b border-black h-8 mt-4 text-blue-800 font-mono">
          123 Compliance Way, Transport City, US
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Driver } from '@/types'

const props = defineProps<{
  driver: Driver
}>()

const fullName = computed(() => {
  const { firstName, middleName, lastName } = props.driver || {}
  return `${firstName || ''} ${middleName || ''} ${lastName || ''}`.trim()
})
</script>
