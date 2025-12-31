<template>
  <form @submit.prevent="saveVehicle" class="space-y-4">
    <div class="space-y-1">
      <label class="block text-xs font-bold text-slate-700"
        >Bus Number <span class="text-red-500">*</span></label
      >
      <input
        v-model.trim="formData.busNumber"
        type="text"
        placeholder="e.g. 104"
        class="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>

    <div class="space-y-1">
      <label class="block text-xs font-bold text-slate-700"
        >VIN <span class="text-red-500">*</span></label
      >
      <input
        v-model.trim="formData.vin"
        type="text"
        placeholder="Vehicle Identification Number"
        class="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1">
        <label class="block text-xs font-bold text-slate-700">Last Annual Insp.</label>
        <input
          v-model="formData.lastAnnualInspection"
          type="date"
          class="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div class="space-y-1">
        <label class="block text-xs font-bold text-slate-700">Mileage</label>
        <input
          v-model.number="formData.mileage"
          type="number"
          class="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
      <button
        v-cursor
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        v-cursor
        type="submit"
        class="px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Save Bus
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/services/firebaseService'
import type { Vehicle } from '@/types'
import { STATUS_ACTIVE } from '@/utils/constants'

const props = defineProps<{
  initialData?: Partial<Vehicle>
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const formData = ref<Partial<Vehicle>>({
  busNumber: '',
  vin: '',
  lastAnnualInspection: '',
  mileage: 0,
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    } else {
      // Reset form for new entry if no initialData is provided
      formData.value = {
        busNumber: '',
        vin: '',
        lastAnnualInspection: '',
        mileage: 0,
      }
    }
  },
  { immediate: true },
) // Run immediately on component mount

async function saveVehicle() {
  const v = formData.value
  if (!v.busNumber || !v.vin) return // Basic validation

  // Add the new vehicle to Firestore
  await addDoc(collection(db, 'artifacts/app/public/data/vehicles'), {
    busNumber: v.busNumber,
    vin: v.vin,
    status: STATUS_ACTIVE, // Default to Active
    lastAnnualInspection: v.lastAnnualInspection || '',
    mileage: v.mileage ?? 0,
  })

  emit('saved')
}
</script>
