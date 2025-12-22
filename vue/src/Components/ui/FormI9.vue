<template>
  <div class="font-sans text-black p-8 border-2 border-slate-300 print:border-none max-w-4xl mx-auto">
    <div class="flex justify-between items-start border-b-2 border-black pb-2 mb-4">
      <div>
        <h1 class="text-xl font-bold">Employment Eligibility Verification</h1>
        <p class="text-xs">Department of Homeland Security<br/>U.S. Citizenship and Immigration Services</p>
      </div>
      <div class="text-right">
        <h2 class="text-2xl font-bold">USCIS Form I-9</h2>
        <p class="text-xs">OMB No. 1615-0047</p>
      </div>
    </div>

    <!-- Section 1 -->
    <div class="mb-6 border border-black p-2 bg-slate-50 opacity-75">
      <h3 class="font-bold text-sm bg-slate-200 px-2 py-1 mb-2">Section 1. Employee Information and Attestation (To be completed by employee)</h3>
      <div class="grid grid-cols-3 gap-2 mb-2">
        <div class="text-xs border-b border-slate-400"><span class="font-bold">Name:</span> {{ fullName }}</div>
        <div class="text-xs border-b border-slate-400"><span class="font-bold">Address:</span> {{ data.w9Address || '' }} {{ data.w9CityStateZip || '' }}</div>
        <div class="text-xs border-b border-slate-400"><span class="font-bold">birthDate:</span> {{ data.birthDate }}</div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="text-xs border-b border-slate-400"><span class="font-bold">SSN:</span> {{ data.ssn }}</div>
        <div class="text-xs border-b border-slate-400"><span class="font-bold">Email:</span> {{ data.email }}</div>
        <div class="text-xs border-b border-slate-400"><span class="font-bold">Phone:</span> {{ data.phone }}</div>
      </div>
      <div class="mt-2 text-xs italic text-slate-500 text-center">
        * Electronically pre-filled from driver profile.
      </div>
    </div>

    <!-- Section 2 - EMPLOYER REVIEW -->
    <div class="border-2 border-black p-4">
      <h3 class="font-bold text-sm bg-slate-200 px-2 py-1 mb-4 border border-black">
        Section 2. Employer or Authorized Representative Review and Verification
      </h3>
      <p class="text-xs mb-4">
        (Employers must examine one document from List A OR a combination of one from List B and one from List C.)
      </p>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="border border-black p-2">
          <h4 class="font-bold text-xs text-center mb-2">List A (Identity & Employment)</h4>
          <input
            type="text"
            placeholder="Document Title (e.g. Passport)"
            class="w-full text-xs border-b border-slate-300 mb-2 focus:outline-none"
            :value="data.i9DocTitle || ''"
            @input="onInput('i9DocTitle', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            placeholder="Issuing Authority"
            class="w-full text-xs border-b border-slate-300 mb-2 focus:outline-none"
            :value="data.i9IssuingAuth || ''"
            @input="onInput('i9IssuingAuth', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            placeholder="Document Number"
            class="w-full text-xs border-b border-slate-300 mb-2 focus:outline-none"
            :value="data.i9DocNumber || ''"
            @input="onInput('i9DocNumber', ($event.target as HTMLInputElement).value)"
          />
          <div class="flex items-center text-xs">
            <span class="mr-2">Exp Date:</span>
            <input
              type="date"
              class="flex-1 border-b border-slate-300 focus:outline-none"
              :value="data.i9DocExp || ''"
              @input="onInput('i9DocExp', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="border border-black p-2 bg-slate-100 flex items-center justify-center text-center">
          <p class="text-xs text-slate-400">OR List B (Identity)</p>
        </div>
        <div class="border border-black p-2 bg-slate-100 flex items-center justify-center text-center">
          <p class="text-xs text-slate-400">AND List C (Employment)</p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t-2 border-black">
        <h4 class="font-bold text-sm mb-2">Certification:</h4>
        <p class="text-[10px] text-justify mb-4">
          I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the above-named employee, (2) the above-listed document(s) appear to be genuine and to relate to the employee named, and (3) to the best of my knowledge the employee is authorized to work in the United States.
        </p>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-bold mb-1">Signature of Employer or Auth. Rep.</label>
            <input
              type="text"
              placeholder="Sign Here (Type Name)"
              class="w-full border-b-2 border-black bg-transparent font-script text-xl text-blue-900 focus:outline-none"
              :value="data.i9EmployerSignature || ''"
              @input="onInput('i9EmployerSignature', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div>
            <label class="block text-xs font-bold mb-1">Today's Date</label>
            <input
              type="date"
              class="w-full border-b-2 border-black bg-transparent font-mono"
              :value="data.i9Date || ''"
              @input="onInput('i9Date', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label class="block text-xs font-bold mb-1">Title of Employer or Auth. Rep.</label>
            <input
              type="text"
              class="w-full border-b border-black bg-transparent text-sm"
              :value="data.i9EmployerTitle || ''"
              @input="onInput('i9EmployerTitle', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div>
            <label class="block text-xs font-bold mb-1">Employer's Name & Address</label>
            <div class="text-xs">CharterSafe Bus Co, 123 Compliance Way</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ 'update:data': [any] }>()

const fullName = computed(() => {
  const parts = [props.data.firstName, props.data.middleName, props.data.lastName]
  return parts.filter(Boolean).join(' ')
})

function onInput(key: string, value: string) {
  emit('update:data', { ...props.data, [key]: value })
}
</script>
