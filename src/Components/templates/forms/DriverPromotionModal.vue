<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserCheck class="w-5 h-5 text-indigo-600" />
          Hire Driver & Activate
        </h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 overflow-y-auto space-y-6">
        <!-- System Warnings -->
        <div
          v-if="systemWarnings.length > 0"
          class="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2"
        >
          <div class="flex items-center gap-2 text-amber-800 font-semibold mb-1">
            <AlertTriangle class="w-4 h-4" />
            <span>Compliance Warnings</span>
          </div>
          <ul class="list-disc list-inside text-sm text-amber-700 space-y-0.5 ml-1">
            <li v-for="(warning, idx) in systemWarnings" :key="idx">{{ warning }}</li>
          </ul>
        </div>

        <!-- Manual Checklist -->
        <div class="space-y-3">
          <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Pre-Hire Checklist (Required)
          </h4>
          <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div class="space-y-3">
              <label
                v-for="(item, idx) in checklistItems"
                :key="idx"
                class="flex items-start gap-3 cursor-pointer group"
              >
                <div class="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    v-model="checklistState[item.key]"
                    class="peer h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <span
                  class="text-sm text-slate-600 peer-checked:text-slate-900 transition-colors group-hover:text-slate-800"
                >
                  {{ item.label }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Hiring Notes (Optional)</label>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Add any additional notes regarding this hire..."
            class="w-full text-sm rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-200 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Confirmation -->
        <div class="pt-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="confirmHire"
              class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-slate-700">
              I confirm that <strong>{{ driverName }}</strong> has met all qualification standards
              and is cleared for duty.
            </span>
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50 rounded-b-xl"
      >
        <BaseButton variant="secondary" label="Cancel" @click="$emit('close')" />
        <BaseButton
          variant="success"
          :disabled="!isValid"
          :label="'Confirm Hire'"
          :loading="loading"
          @click="submit"
          :icon="UserCheck"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserCheck, X, AlertTriangle } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import type { Driver } from '@/types'
import dayjs from 'dayjs'

const props = defineProps<{
  isOpen: boolean
  driver: Driver
  loading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const notes = ref('')
const confirmHire = ref(false)
const checklistState = ref<Record<string, boolean>>({})

const driverName = computed(() => {
  return `${props.driver.firstName} ${props.driver.lastName}`
})

// Checklist Items Config
const checklistItems = [
  { key: 'safetyHistory', label: 'Safety Performance History Investigation (Preceding 3 Years)' },
  { key: 'goodFaith', label: 'Good Faith Effort Document (When Required)' },
  { key: 'drugTest', label: 'Pre-Employment Drug Test Result (Negative)' },
  { key: 'randomProgram', label: 'Placed in Random Drug/Alcohol Testing Program' },
  { key: 'dutyTime', label: 'Preceding 7 Days Time on Duty Statement (Maintain for 6mo)' },
]

// System Logic Checks
const systemWarnings = computed(() => {
  const w: string[] = []
  if (
    !props.driver.license?.expiryDate ||
    dayjs(props.driver.license.expiryDate).isBefore(dayjs())
  ) {
    w.push('Driver License is expired or missing.')
  }
  if (
    !props.driver.medical?.expiryDate ||
    dayjs(props.driver.medical.expiryDate).isBefore(dayjs())
  ) {
    w.push('Medical Certificate is expired or missing.')
  }
  // Add other logic if needed (e.g. MVR date check)
  return w
})

const allChecklistItemsChecked = computed(() => {
  return checklistItems.every((item) => checklistState.value[item.key])
})

const isValid = computed(() => {
  return confirmHire.value && allChecklistItemsChecked.value
})

function submit() {
  if (!isValid.value) return

  emit('confirm', {
    notes: notes.value,
    checklist: checklistState.value,
  })
}

// Initialize checklist to false
onMounted(() => {
  checklistItems.forEach((item) => {
    checklistState.value[item.key] = false
  })
})
</script>
