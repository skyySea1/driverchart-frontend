<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-slate-800">Executive Reports</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Expiration Forecast -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold mb-4 text-slate-700">90-Day Expiration Forecast</h3>

        <div class="overflow-y-auto max-h-64">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 border-b">
                <th class="pb-2">Driver</th>
                <th class="pb-2">Item</th>
                <th class="pb-2">Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in expiringSoon" :key="i" class="border-b border-slate-50">
                <td class="py-2">{{ item.driver }}</td>
                <td class="py-2">
                  <span class="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                    {{ item.type }}
                  </span>
                </td>
                <td class="py-2 font-mono">{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Missing Documentation -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold mb-4 text-red-700">Missing Documentation Audit</h3>

        <div class="overflow-y-auto max-h-64">
          <p v-if="missingDocs.length === 0" class="text-green-600">All clean!</p>

          <ul v-else class="space-y-2">
            <li
              v-for="d in missingDocs"
              :key="d.id"
              class="flex justify-between items-center p-2 bg-red-50 rounded"
            >
              <span class="font-medium text-slate-700"> {{ d.firstName }} {{ d.lastName }} </span>

              <div class="flex gap-1">
                <span v-if="!d.cdl.file" class="text-[10px] bg-red-200 px-1 rounded"> CDL </span>
                <span v-if="!d.medical.file" class="text-[10px] bg-red-200 px-1 rounded">
                  MED
                </span>
                <span v-if="!d.roadTest.file" class="text-[10px] bg-red-200 px-1 rounded">
                  ROAD
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Compliance Matrix -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 class="text-lg font-bold mb-4">Compliance Matrix</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-center text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-600">
              <th class="p-3 text-left">Driver Name</th>
              <th class="p-3">CDL</th>
              <th class="p-3">Medical</th>
              <th class="p-3">MVR</th>
              <th class="p-3">Drug/Alc</th>
              <th class="p-3">Road Test</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr v-for="d in props.drivers" :key="d.id">
              <td class="p-3 text-left font-medium">{{ d.lastName }}, {{ d.firstName }}</td>

              <td class="p-3">
                <StatusDot :ok="!!d.cdl.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.medical.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.mvr.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.drugAlcohol.expiryDate" neutral />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.roadTest.date" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Driver, Vehicle } from '@/types'
import dayjs from 'dayjs'

const props = defineProps<{
  drivers: Driver[]
  vehicles?: Vehicle[]
}>()

const expiringSoon = computed(() => {
  const items: { driver: string; type: string; date: string }[] = []

  const now = dayjs()

  for (const d of props.drivers) {
    const check = (date: string | undefined, type: string) => {
      if (!date) return
      const diff = dayjs(date).diff(now, 'day')
      if (diff > 0 && diff < 90) {
        items.push({
          driver: `${d.firstName} ${d.lastName}`,
          type,
          date,
        })
      }
    }

    check(d.cdl.expiryDate, 'CDL')
    check(d.medical.expiryDate, 'Medical')
  }

  return items
})

const missingDocs = computed(() =>
  props.drivers.filter((d) => !d.cdl.file || !d.medical.file || !d.mvr.file || !d.roadTest.file),
)
</script>

<!-- Componente pequeno e reutilizável -->
<script lang="ts">
import { defineComponent } from 'vue'
export const StatusDot = defineComponent({
  props: {
    ok: Boolean,
    neutral: Boolean,
  },
  template: `
    <div
      class="w-3 h-3 rounded-full mx-auto"
      :class="
        neutral
          ? ok ? 'bg-green-500' : 'bg-gray-300'
          : ok ? 'bg-green-500' : 'bg-red-500'
      "
    ></div>
  `,
})
export default {}
</script>
