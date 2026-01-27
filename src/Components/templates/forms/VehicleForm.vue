<template>
  <form @submit.prevent="saveVehicle" class="space-y-4">
    <div v-if="errorMsg" class="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
      {{ errorMsg }}
    </div>

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
        :disabled="isSaving"
        class="px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : 'Save Bus' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dataService } from '@/services/dataService'
import type { Vehicle } from '@/types'
import { STATUS_ACTIVE } from '@/utils/constants'
import { VehicleSchema, type VehicleFormData } from '@/schemas/vehicleSchema'
import { sanitizeInput } from '@/utils/utils'

const props = defineProps<{
  initialData?: Vehicle
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const isSaving = ref(false)
const errorMsg = ref('')
const formData = ref<VehicleFormData>({
  busNumber: '',
  vin: '',
  lastAnnualInspection: '',
  mileage: 0,
  vehicleStatus: 'Active',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        busNumber: newVal.busNumber ?? '',
        vin: newVal.vin ?? '',
        lastAnnualInspection: newVal.lastAnnualInspection ?? '',
        mileage: newVal.mileage ?? 0,
        vehicleStatus: newVal.vehicleStatus ?? 'Active',
      }
    } else {
      formData.value = {
        busNumber: '',
        vin: '',
        lastAnnualInspection: '',
        mileage: 0,
        vehicleStatus: 'Active',
      }
    }
  },
  { immediate: true },
)

async function saveVehicle() {
  errorMsg.value = ''

  // Sanitize input before validation
  const cleanBusNumber = sanitizeInput(formData.value.busNumber || '')
  const cleanVin = sanitizeInput(formData.value.vin || '')

  // Validate using Zod
  const result = VehicleSchema.safeParse({
    ...formData.value,
    busNumber: cleanBusNumber,
    vin: cleanVin,

    // Ensure defaults if fields are missing/empty
    lastAnnualInspection: formData.value.lastAnnualInspection || '',
    mileage: formData.value.mileage || 0,
    vehicleStatus: formData.value.vehicleStatus || STATUS_ACTIVE,
  })

  if (!result.success) {
    const issues = result.error.issues
    errorMsg.value = issues.map((i) => i.message).join('. ')
    return
  }

  isSaving.value = true
  try {
    // Cast Zod result to Vehicle-compatible type for dataService
    const dataToSave = result.data

    if (props.initialData?.id) {
      await dataService.updateVehicle({ ...dataToSave, id: props.initialData.id })
    } else {
      await dataService.addVehicle(dataToSave)
    }
    emit('saved')
  } catch (error) {
    console.error('Error saving vehicle:', error)
    errorMsg.value = 'Failed to save vehicle. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>
