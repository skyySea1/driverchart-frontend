<!-- src/Views/PublicApplicationForm.vue -->

<template>
  <AnimatedBody>
    <!-- Application Card -->
    <div class="app-card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
      <div class="bg-slate-900 p-8 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-3">
            <Bus class="w-8 h-8 text-blue-400 shrink-0" />

            <h1 class="text-2xl font-bold text-white">CharterSafe</h1>
          </div>

          <div class="space-y-1">
            <h2 class="text-xl font-bold text-indigo-100">Driver Application</h2>

            <p class="text-xs text-indigo-300 uppercase tracking-widest font-semibold">
              Join our professional team
            </p>
          </div>
        </div>
      </div>

      <div class="p-8">
        <div v-if="submitted" class="text-center py-8">
          <div
            class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6"
          >
            <Check class="w-8 h-8 text-green-600" />
          </div>

          <h2 class="text-2xl font-bold text-slate-800">Application Received!</h2>

          <p class="text-slate-600 mt-4 leading-relaxed">
            Thank you for applying to <strong>CharterSafe</strong>. Our compliance team will review
            your information and contact you shortly.
          </p>

          <button
            @click="reset"
            class="mt-8 px-6 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
          >
            Submit Another Application
          </button>
        </div>

        <form v-else @submit.prevent="submit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                >First Name <span class="text-red-500">*</span></label
              >

              <input
                v-model="form.firstName"
                required
                class="input-base w-full"
                placeholder="John"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                >Last Name <span class="text-red-500">*</span></label
              >

              <input v-model="form.lastName" required class="input-base w-full" placeholder="Doe" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
              >Email Address <span class="text-red-500">*</span></label
            >

            <input
              v-model="form.email"
              type="email"
              required
              class="input-base w-full"
              placeholder="john.doe@example.com"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
              >Phone Number <span class="text-red-500">*</span></label
            >

            <input
              v-model="form.phone"
              type="tel"
              required
              class="input-base w-full"
              placeholder="(555) 000-0000"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                >Exp. (Years)</label
              >

              <input
                v-model.number="form.experienceYears"
                type="number"
                min="0"
                class="input-base w-full"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                >Cdl Number</label
              >

              <input
                v-model="form.cdlNumber"
                class="input-base w-full"
                placeholder="A123-456-..."
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
              >Additional Notes</label
            >

            <textarea
              v-model="form.notes"
              rows="2"
              class="input-base w-full"
              placeholder="Previous experience, certifications, etc."
            ></textarea>
          </div>

          <div class="pt-4">
            <button
              v-cursor
              type="submit"
              :disabled="loading"
              class="btn-up-hover-effect w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />

              <span>{{ loading ? 'Submitting Application...' : 'Submit Application' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-4 text-center w-full z-10">
      <p class="text-white text-[10px] font-bold uppercase tracking-widest opacity-60">
        &copy; 2026 PhoenixBus Orlando
      </p>
    </div>
  </AnimatedBody>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dataService } from '@/services/dataService'
import { Check, Bus, Loader2 } from 'lucide-vue-next'
import AnimatedBody from '@/Components/ui/AnimatedBody.vue'

const loading = ref(false)
const submitted = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  experienceYears: 0,
  cdlNumber: '',
  notes: '',
})

async function submit() {
  loading.value = true

  try {
    await dataService.submitApplication({
      ...form.value,
      experienceYears: form.value.experienceYears || 0,
    })

    submitted.value = true
  } catch (err) {
    console.error('Error submitting application:', err)

    alert('Failed to submit application. Please try again.')
  } finally {
    loading.value = false
  }
}
// implement reset using loop
function reset() {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceYears: 0,
    cdlNumber: '',
    notes: '',
  }
  submitted.value = false
}
</script>

<style scoped>
/* App card needs to have a higher z-index */

.app-card {
  position: relative;
  z-index: 10;
}
</style>
