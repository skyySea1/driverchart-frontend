<template>
  <div class="space-y-6">
    <!-- Loading & Error States -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
      {{ error }}
    </div>

    <div v-else-if="applicant" class="space-y-6">
      <!-- Back Button -->
      <BaseButton label="Back to Drivers" :icon="ArrowLeft" :variant="'blue'" @click="$router.back()"
        class=" text-sm font-medium shadow-sm"
          />
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="flex items-center gap-4">
          <div
            class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200 uppercase"
          >
            {{ applicant.firstName[0] }}{{ applicant.lastName[0] }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">
              {{ capitalizeName(applicant.firstName) }} {{ capitalizeName(applicant.lastName) }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="getStatusColor(applicant.status)"
              >
                {{ applicant.status }}
              </span>
              <span class="text-sm text-slate-500 flex items-center gap-1">
                <Calendar class="w-3 h-3" /> Applied: {{ formatDate(applicant.appliedDate) }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <!-- Actions for Applicant -->
          <button
          v-cursor
            v-if="applicant.status === 'Pending'"
            @click="updateStatus('Approved')"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
          >
            <Check class="w-4 h-4" /> Approve
          </button>
          <button
          v-cursor
            v-if="applicant.status === 'Pending'"
            @click="updateStatus('Rejected')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
          >
            <X class="w-4 h-4" /> Reject
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Identity & Contact Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 h-fit">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <User class="w-5 h-5 text-slate-400" /> Applicant Details
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Full Name</span>
              <span class="font-medium text-slate-900"
                >{{ capitalizeName(applicant.firstName) }}
                {{ capitalizeName(applicant.lastName) }}</span
              >
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Contact</span>
              <div class="flex items-center gap-2 text-slate-900">
                <Phone class="w-3 h-3 text-slate-400" /> {{ applicant.phone }}
              </div>
              <div class="flex items-center gap-2 text-slate-900">
                <Mail class="w-3 h-3 text-slate-400" /> {{ applicant.email }}
              </div>
            </div>
          </div>
        </div>

        <!-- Qualifications Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 h-fit">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Briefcase class="w-5 h-5 text-slate-400" /> Qualifications
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Cdl Number</span>
              <span class="font-medium text-slate-900 font-mono">{{
                applicant.cdlNumber || 'Not Provided'
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Experience</span>
              <span class="font-medium text-slate-900">{{ applicant.experienceYears }} Years</span>
            </div>
            <div class="flex flex-col gap-1 pt-2 border-t border-slate-100">
              <span class="text-slate-500">Notes / Cover Letter</span>
              <p class="text-slate-700 italic">{{ applicant.notes || 'No notes provided.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dataService } from '@/services/dataService'
import type { Application } from '@/types'
import { capitalizeName, formatDate } from '@/utils/utils'
import { User, Phone, Mail, Calendar, Check, X, Briefcase, ArrowLeft } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/BaseButton.vue'

const route = useRoute()
const applicationId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const applicant = ref<Application | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200'
  }
}

const fetchApplicantData = async () => {
  if (!applicationId.value) return

  isLoading.value = true
  error.value = null
  try {
    const data = await dataService.getApplicationById(applicationId.value)
    if (data) {
      applicant.value = data
    } else {
      error.value = 'Applicant not found'
    }
  } catch (err) {
    error.value = 'Failed to load applicant data'
    console.error('Error fetching applicant:', err)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (status: 'Approved' | 'Rejected') => {
  if (!applicant.value) return
  try {
    await dataService.updateApplicationStatus(applicant.value.id, status)
    applicant.value.status = status
  } catch (err) {
    console.error('Error updating status:', err)
    alert('Failed to update status')
  }
}

onMounted(() => {
  fetchApplicantData()
})

watch(applicationId, () => {
  fetchApplicantData()
})
</script>
