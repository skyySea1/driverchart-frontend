<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center print:hidden">
      <h2 class="text-2xl font-bold text-slate-800">Executive Compliance Reports</h2>
      <BaseButton label="Print Compliance Package"
        @click="printReports"
        :icon="Printer"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600"
      >
        <Printer class="w-4 h-4" />
        Print Compliance Package
      </BaseButton>
    </div>

    <!-- Print-only Header -->
    <div class="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter">Compliance Executive Summary</h1>
          <p class="text-slate-600 mt-1 font-bold uppercase text-sm">US DOT #1234567 | Charter Bus Operations</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold">Report Date: {{ currentDateTime }}</p>
          <p class="text-xs text-slate-500">System: VueBus Compliance v1.0</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-8">
      <!-- Expiration Forecast -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200">
        <h3 class="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
          <Calendar class="w-5 h-5 text-primary-500 print:hidden" />
          90-Day Expiration Forecast
        </h3>

        <div class="overflow-y-auto max-h-96 print:max-h-none">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 border-b border-slate-200">
                <th class="pb-2 font-bold uppercase tracking-wider text-[10px]">Driver</th>
                <th class="pb-2 font-bold uppercase tracking-wider text-[10px]">Item</th>
                <th class="pb-2 font-bold uppercase tracking-wider text-[10px]">Due Date</th>
                <th class="pb-2 font-bold uppercase tracking-wider text-[10px] text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="(item, i) in expiringSoon" :key="i">
                <td class="py-2 font-medium">{{ item.driver }}</td>
                <td class="py-2">
                  <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase print:bg-white print:border print:border-slate-200">
                    {{ item.type }}
                  </span>
                </td>
                <td class="py-2 font-mono text-xs">{{ formatDate(item.date) }}</td>
                <td class="py-2 text-right">
                  <span
                    class="text-[10px] font-bold uppercase"
                    :class="getDaysRemaining(item.date) < 15 ? 'text-red-600' : 'text-orange-600'"
                  >
                    {{ getDaysRemaining(item.date) }} Days Left
                  </span>
                </td>
              </tr>
              <tr v-if="expiringSoon.length === 0">
                <td colspan="4" class="py-8 text-center text-slate-400 italic">No expirations in the next 90 days.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Missing Documentation -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200">
        <h3 class="text-lg font-bold mb-4 text-red-700 flex items-center gap-2">
          <AlertTriangle class="w-5 h-5 print:hidden" />
          Critical Documentation Gaps
        </h3>

        <div class="overflow-y-auto max-h-96 print:max-h-none">
          <div v-if="missingDocs.length === 0" class="flex flex-col items-center justify-center py-8 text-green-600">
            <CheckCircle class="w-12 h-12 mb-2 opacity-20" />
            <p class="font-bold">100% Document Compliance</p>
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="d in missingDocs"
              :key="d.id"
              class="flex flex-col p-3 bg-red-50 rounded-lg border border-red-100 print:bg-white print:border-slate-200"
            >
              <div class="flex justify-between items-center mb-2">
                 <span class="font-bold text-slate-900"> {{ d.firstName }} {{ d.lastName }} </span>
                 <span class="text-[10px] font-bold text-red-600 uppercase">Missing Action Required</span>
              </div>
<!--  todo review criteria field file x expirydate -->
              <div class="flex flex-wrap gap-2">
                <span v-if="!d.cdl?.expiryDate" class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase">CDL</span>
                <span v-if="!d.medical?.expiryDate" class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase">Med Card</span>
                <span v-if="!d.mvr?.expiryDate" class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase">Annual MVR</span>
                <span v-if="!d.roadTest?.date" class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase">Road Test</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Compliance Matrix -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200 print:mt-8">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <ShieldCheck class="w-5 h-5 text-green-500 print:hidden" />
        Full Fleet Compliance Matrix
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-center text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 print:bg-white print:border-b-2 print:border-slate-900">
              <th class="p-3 text-left font-bold uppercase tracking-wider text-[10px]">Driver Name</th>
              <th class="p-3 font-bold uppercase tracking-wider text-[10px]">CDL</th>
              <th class="p-3 font-bold uppercase tracking-wider text-[10px]">Med Card</th>
              <th class="p-3 font-bold uppercase tracking-wider text-[10px]">MVR</th>
              <th class="p-3 font-bold uppercase tracking-wider text-[10px]">D & A</th>
              <th class="p-3 font-bold uppercase tracking-wider text-[10px]">Road Test</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="d in drivers" :key="d.id" class="hover:bg-slate-50 transition-colors">
              <td class="p-3 text-left font-medium text-slate-900 whitespace-nowrap">{{ d.firstName }} {{ d.lastName }}</td>

              <td class="p-3">
                <StatusDot :ok="!!d.cdl?.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.medical?.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.mvr?.expiryDate" />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.drugAlcohol?.expiryDate" neutral />
              </td>
              <td class="p-3">
                <StatusDot :ok="!!d.roadTest?.date" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex gap-4 text-[10px] font-bold print:flex">
         <div class="flex items-center gap-1"><StatusDot :ok="true" /> Valid</div>
         <div class="flex items-center gap-1"><StatusDot :ok="false" /> Missing/Expired</div>
         <div class="flex items-center gap-1"><StatusDot :ok="false" neutral /> Optional/N.A.</div>
      </div>
    </div>

    <!-- Print-only Footer -->
    <div class="hidden print:block mt-auto pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400">
      <p>This report is generated for DOT Compliance purposes. Confidential - Internal Use Only.</p>
      <p>Page 1 of 1</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Driver } from '@/types'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import { parseDriverDoc } from '@/utils/firestoreParsers'
import StatusDot from '@/Components/ui/StatusDot.vue'
import { Printer, Calendar, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-vue-next'
import dayjs from 'dayjs'
import BaseButton from '@/Components/ui/BaseButton.vue'

// Real-time Collections
const appId = import.meta.env.VITE_APP_ID
const { items: drivers } = useRealtimeCollection<Driver>(
  `artifacts/${appId}/public/data/drivers`,
  { map: parseDriverDoc },
)

const currentDateTime = computed(() => dayjs().format('MMMM DD, YYYY HH:mm'))

const expiringSoon = computed(() => {
  const items: { driver: string; type: string; date: string }[] = []
  const now = dayjs()

  for (const d of drivers.value) {
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

    check(d.cdl?.expiryDate, 'CDL')
    check(d.medical?.expiryDate, 'Med Card')
    check(d.mvr?.expiryDate, 'Annual MVR')
    check(d.drugAlcohol?.expiryDate, 'Clearinghouse')
  }

  // Sort by date (nearest first)
  return items.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
})

const missingDocs = computed(() =>
  drivers.value.filter(
    (d) =>
      !d.cdl?.expiryDate ||
      !d.medical?.expiryDate ||
      !d.mvr?.expiryDate ||
      !d.roadTest?.date
  ),
)

const formatDate = (date?: string) => {
  if (!date) return '-'
  return dayjs(date).format('MM/DD/YYYY')
}

const getDaysRemaining = (date: string) => {
  return dayjs(date).diff(dayjs(), 'day')
}

const printReports = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  /* Ensure page breaks don't happen inside cards if possible */
  .bg-white {
    break-inside: avoid;
  }
}
</style>
