<template>
  <div class="space-y-8">
    <!-- Personal Information -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <User class="w-5 h-5 text-slate-500" /> Personal Information
      </h3>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
      >
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
          <p class="text-slate-900 font-medium">{{ fullName }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
          <p class="text-slate-900 font-medium">
            {{ formatDate(applicant.personalInfo.dob as string) }}
          </p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">SSN</label>
          <p class="text-slate-900 font-medium font-mono">
            {{ formatSSN(applicant.personalInfo.ssnNumber) || 'N/A' }}
          </p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Phone</label>
          <p class="text-slate-900 font-medium">{{ applicant.personalInfo.phone }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Email</label>
          <p class="text-slate-900 font-medium">{{ applicant.personalInfo.email }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase">Hire Date / Status</label>
          <div class="flex items-center gap-2">
            <span class="text-slate-900 font-medium">{{
              formatDate(applicant.hireDate as string)
            }}</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"
              >{{ applicant.hireStatus }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Address History -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <MapPin class="w-5 h-5 text-slate-500" /> Address History
      </h3>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-slate-600">Address</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-600">City/State/Zip</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-600">From</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-600">To</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(addr, idx) in applicant.addresses" :key="idx" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-slate-900">{{ addr.street }}</td>
              <td class="px-4 py-3 text-slate-600">
                {{ addr.city }}, {{ addr.state }} {{ addr.zip }}
              </td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(addr.fromDate) }}</td>
              <td class="px-4 py-3 text-slate-600">
                {{ addr.present ? 'Present' : formatDate(addr.toDate) }}
              </td>
            </tr>
            <tr v-if="!applicant.addresses?.length">
              <td colspan="4" class="px-4 py-6 text-center text-slate-400 italic">
                No address history provided.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Employment History -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Briefcase class="w-5 h-5 text-slate-500" /> Employment History
      </h3>
      <div v-if="applicant.employmentHistory?.length" class="space-y-4">
        <div
          v-for="(emp, idx) in applicant.employmentHistory"
          :key="idx"
          class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-bold text-slate-900 text-lg">{{ emp.companyName }}</h4>
              <p class="text-slate-500 text-sm">{{ emp.city }}, {{ emp.state }}</p>
            </div>
            <div class="text-right text-sm text-slate-600">
              <p class="font-medium">
                {{ formatDate(emp.fromDate) }} -
                {{ emp.present ? 'Present' : formatDate(emp.toDate) }}
              </p>
              <p class="text-xs text-slate-400">Position: {{ emp.position }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
            <div>
              <span class="text-slate-400 block text-xs">Reason for Leaving</span>
              <span class="text-slate-800">{{ emp.reasonForLeaving }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-xs">CDL Required?</span>
              <span class="text-slate-800">{{ emp.wasCdl ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-400 italic"
      >
        No employment history provided.
      </div>
    </section>

    <!-- Driving Experience -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Truck class="w-5 h-5 text-slate-500" /> Driving Experience
      </h3>

      <!-- Licenses -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h4
          class="font-bold text-slate-700 text-sm uppercase tracking-wider border-b border-slate-100 pb-2"
        >
          Licenses
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs font-semibold text-slate-500">
                <th class="pb-2">State</th>
                <th class="pb-2">License #</th>
                <th class="pb-2">Class</th>
                <th class="pb-2">Expiration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(lic, idx) in applicant.licenses" :key="idx">
                <td class="py-2 pr-4">{{ lic.state }}</td>
                <td class="py-2 pr-4 font-mono">{{ lic.number }}</td>
                <td class="py-2 pr-4">{{ lic.class }}</td>
                <td class="py-2 pr-4">{{ formatDate(lic.expirationDate) }}</td>
              </tr>
              <tr v-if="!applicant.licenses?.length">
                <td colspan="4" class="py-4 text-center text-slate-400 italic">
                  No licenses listed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accidents & Violations Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Accidents -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4
            class="font-bold text-slate-700 text-sm uppercase tracking-wider border-b border-slate-100 pb-2"
          >
            Accident Record (Last 3 Years)
          </h4>
          <div v-if="applicant.accidents?.length" class="space-y-3">
            <div
              v-for="(acc, idx) in applicant.accidents"
              :key="idx"
              class="text-sm bg-slate-50 p-3 rounded-lg"
            >
              <div class="flex justify-between font-medium text-slate-900">
                <span>{{ formatDate(acc.date) }}</span>
                <span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{{
                  acc.fatalities ? 'Fatalities' : acc.injuries ? 'Injuries' : 'Property Only'
                }}</span>
              </div>
              <p class="text-slate-600 mt-1">{{ acc.description }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ acc.location }}</p>
            </div>
          </div>
          <div v-else class="text-center text-slate-400 italic text-sm py-4">
            No accidents reported.
          </div>
        </div>

        <!-- Violations -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4
            class="font-bold text-slate-700 text-sm uppercase tracking-wider border-b border-slate-100 pb-2"
          >
            Traffic Convictions (Last 3 Years)
          </h4>
          <div v-if="applicant.violations?.length" class="space-y-3">
            <div
              v-for="(vio, idx) in applicant.violations"
              :key="idx"
              class="text-sm bg-slate-50 p-3 rounded-lg"
            >
              <div class="flex justify-between font-medium text-slate-900">
                <span>{{ formatDate(vio.date) }}</span>
                <span class="text-slate-500">{{ vio.penalty || 'No Penalty' }}</span>
              </div>
              <p class="text-slate-600 mt-1">{{ vio.violation }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ vio.location }}</p>
            </div>
          </div>
          <div v-else class="text-center text-slate-400 italic text-sm py-4">
            No convictions reported.
          </div>
        </div>
      </div>
    </section>

    <!-- Legal & General -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Scale class="w-5 h-5 text-slate-500" /> Legal & Background
      </h3>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <span class="font-medium text-slate-900">License Denied/Revoked?</span>
            <div class="flex items-center gap-2">
              <span
                :class="
                  applicant.deniedLicense ? 'text-red-600 font-bold' : 'text-green-600 font-medium'
                "
              >
                {{ applicant.deniedLicense ? 'YES' : 'NO' }}
              </span>
            </div>
          </div>
          <div class="space-y-1">
            <span class="font-medium text-slate-900">License Suspended?</span>
            <div class="flex items-center gap-2">
              <span
                :class="
                  applicant.suspendedLicense
                    ? 'text-red-600 font-bold'
                    : 'text-green-600 font-medium'
                "
              >
                {{ applicant.suspendedLicense ? 'YES' : 'NO' }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="applicant.denialSuspensionExplanation"
          class="bg-red-50 p-4 rounded-lg text-red-800"
        >
          <p class="font-bold text-xs uppercase mb-1">Explanation</p>
          <p>{{ applicant.denialSuspensionExplanation }}</p>
        </div>
      </div>
    </section>

    <!-- Signatures & Declarations -->
    <section class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <FileSignature class="w-5 h-5 text-slate-500" /> Signatures & Consents
      </h3>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="divide-y divide-slate-100">
          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">Drug & Alcohol Test Consent</div>
            <div class="text-right">
              <div
                v-if="applicant.drugTestSignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.drugTestSignature }}
              </div>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">PSP Disclosure</div>
            <div class="text-right">
              <div
                v-if="applicant.pspDisclosureSignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.pspDisclosureSignature }}
              </div>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">FMCSA Clearinghouse Consent</div>
            <div class="text-right">
              <div
                v-if="applicant.fmcsaConsentSignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.fmcsaConsentSignature }}
              </div>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">Authorization & Release</div>
            <div class="text-right">
              <div
                v-if="applicant.authReleaseSignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.authReleaseSignature }}
              </div>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">General Work Policy</div>
            <div class="text-right">
              <div
                v-if="applicant.generalWorkPolicySignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.generalWorkPolicySignature }}
              </div>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50">
            <div class="text-sm font-medium text-slate-900">Fair Credit Reporting Act</div>
            <div class="text-right">
              <div
                v-if="applicant.fairCreditReportingSignature"
                class="text-green-600 text-xs font-bold flex items-center gap-1 justify-end"
              >
                <CheckCircle2 class="w-3 h-3" /> Signed
              </div>
              <div v-else class="text-orange-500 text-xs italic">Missing</div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ applicant.fairCreditReportingSignature }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DriverApplicationForm, Applications } from '@/types'
import { User, MapPin, Briefcase, Truck, Scale, FileSignature, CheckCircle2 } from 'lucide-vue-next'
import { capitalizeName, formatDate, formatSSN } from '@/utils/utils'

type ApplicantData = Applications & DriverApplicationForm

const props = defineProps<{
  applicant: ApplicantData
}>()

const fullName = computed(() => {
  const { firstName, middleName, lastName } = props.applicant.personalInfo
  return `${capitalizeName(firstName)} ${middleName ? capitalizeName(middleName) + ' ' : ''}${capitalizeName(lastName)}`
})
</script>
