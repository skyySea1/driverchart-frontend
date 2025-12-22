<template>
  <div class="font-sans text-black p-8 border-2 border-slate-300 print:border-none max-w-4xl mx-auto">
    <div class="flex justify-between items-start border-b-2 border-black pb-2 mb-4">
      <div>
        <h2 class="text-xl font-bold">Form W-9</h2>
        <p class="text-xs">(Rev. October 2018)</p>
      </div>
      <div class="text-center">
        <h1 class="text-2xl font-bold">
          Request for Taxpayer<br />Identification Number and Certification
        </h1>
      </div>
      <div>
        <p class="text-xs font-bold">Give Form to the<br />requester. Do not<br />send to the IRS.</p>
      </div>
    </div>

    <div class="space-y-0 border border-black">
      <!-- 1. Name -->
      <div class="p-2 border-b border-black">
        <label class="text-xs font-bold block">1 Name (as shown on your income tax return). Name is required on this line; do not leave this line blank.</label>
        <input
          type="text"
          class="w-full font-mono text-lg uppercase bg-transparent border-none focus:ring-0"
          :value="fullName"
          readonly
        />
      </div>

      <!-- 2. Business name -->
      <div class="p-2 border-b border-black">
        <label class="text-xs font-bold block">2 Business name/disregarded entity name, if different from above</label>
        <input
          type="text"
          class="w-full font-mono bg-transparent focus:ring-0 border-b border-dotted border-slate-300"
          :value="data.businessName || ''"
          @input="onInput('businessName', ($event.target as HTMLInputElement).value)"
          placeholder=""
        />
      </div>

      <!-- 3. Tax classification + 4. Exemptions -->
      <div class="p-2 border-b border-black flex">
        <div class="w-2/3 border-r border-black pr-2">
          <label class="text-xs font-bold block mb-1">3 Check appropriate box for federal tax classification of the person whose name is entered on line 1. Check only one of the following seven boxes.</label>
          <div class="flex flex-wrap gap-3 text-xs">
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 'individual'" @change="onInput('taxClassification', 'individual')" />
              Individual/sole proprietor
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 'c_corp'" @change="onInput('taxClassification', 'c_corp')" />
              C Corporation
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 's_corp'" @change="onInput('taxClassification', 's_corp')" />
              S Corporation
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 'partnership'" @change="onInput('taxClassification', 'partnership')" />
              Partnership
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 'trust_estate'" @change="onInput('taxClassification', 'trust_estate')" />
              Trust/estate
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" name="taxClass" :checked="data.taxClassification === 'llc'" @change="onInput('taxClassification', 'llc')" />
              LLC
            </label>
          </div>
        </div>
        <div class="w-1/3 pl-2">
          <label class="text-xs font-bold block">4 Exemptions (codes apply only to certain entities, not individuals)</label>
        </div>
      </div>

      <!-- 5. Address -->
      <div class="p-2 border-b border-black">
        <label class="text-xs font-bold block">5 Address (number, street, and apt. no.)</label>
        <input
          type="text"
          class="w-full font-mono bg-transparent border-none focus:ring-0"
          :value="data.w9Address || ''"
          @input="onInput('w9Address', ($event.target as HTMLInputElement).value)"
          placeholder="Enter Address"
        />
      </div>

      <!-- 6. City/State/ZIP + 7. Account numbers -->
      <div class="flex border-b border-black">
        <div class="w-2/3 p-2 border-r border-black">
          <label class="text-xs font-bold block">6 City, state, and ZIP code</label>
          <input
            type="text"
            class="w-full font-mono bg-transparent border-none focus:ring-0"
            :value="data.w9CityStateZip || ''"
            @input="onInput('w9CityStateZip', ($event.target as HTMLInputElement).value)"
            placeholder="City, State, ZIP"
          />
        </div>
        <div class="w-1/3 p-2">
          <label class="text-xs font-bold block">7 List account number(s) here (optional)</label>
          <input
            type="text"
            class="w-full font-mono bg-transparent border-b border-dotted border-slate-300 focus:ring-0"
            :value="data.accountNumber || ''"
            @input="onInput('accountNumber', ($event.target as HTMLInputElement).value)"
            placeholder="Account number(s)"
          />
        </div>
      </div>

      <!-- Part I: TIN -->
      <div class="p-4 border-b border-black">
        <h3 class="font-bold text-sm mb-2">Part I - Taxpayer Identification Number (TIN)</h3>
        <div class="flex items-center">
          <div class="w-1/2 pr-4">
            <label class="text-xs block mb-1">Social Security Number</label>
            <div class="flex gap-2">
              <div class="border border-black p-1 w-full text-center font-mono text-lg bg-slate-50">
                {{ data.ssn || '   -  -    ' }}
              </div>
            </div>
          </div>
          <div class="text-xs w-1/2 italic text-slate-500">
            Enter your SSN in the appropriate box. The TIN provided must match the name given on line 1 to avoid backup withholding.
          </div>
        </div>
      </div>

      <!-- Part II: Certification -->
      <div class="p-4 bg-slate-50">
        <h3 class="font-bold text-sm mb-2">Part II - Certification</h3>
        <p class="text-xs text-justify mb-4 leading-tight">
          Under penalties of perjury, I certify that: <br />
          1. The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and <br />
          2. I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and <br />
          3. I am a U.S. citizen or other U.S. person (defined below); and <br />
          4. The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.
        </p>

        <div class="mt-6 border-t border-dashed border-slate-400 pt-4">
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              class="w-5 h-5 text-blue-600 rounded mr-2"
              :checked="data.w9Signed || false"
              @change="onInput('w9Signed', ($event.target as HTMLInputElement).checked)"
            />
            <span class="text-sm font-bold text-blue-800">I Agree and Certify (Electronic Signature)</span>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div>
              <label class="block text-xs font-bold mb-1">Signature of U.S. person</label>
              <input
                type="text"
                placeholder="Type Full Name to Sign"
                class="w-full border-b-2 border-black bg-transparent font-script text-2xl text-blue-900 focus:outline-none"
                :value="data.w9Signature || ''"
                @input="onInput('w9Signature', ($event.target as HTMLInputElement).value)"
                :disabled="!data.w9Signed"
              />
            </div>
            <div>
              <label class="block text-xs font-bold mb-1">Date</label>
              <input
                type="date"
                class="w-full border-b-2 border-black bg-transparent font-mono"
                :value="data.w9Date || ''"
                @input="onInput('w9Date', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type W9Data = {
  firstName?: string
  middleName?: string
  lastName?: string
  ssn?: string
  w9Address?: string
  w9CityStateZip?: string
  w9Signed?: boolean
  w9Signature?: string
  w9Date?: string
  businessName?: string
  taxClassification?: 'individual' | 'c_corp' | 's_corp' | 'partnership' | 'trust_estate' | 'llc'
  accountNumber?: string
}

const props = defineProps<{ data: W9Data }>()
const emit = defineEmits<{ 'update:data': [W9Data] }>()

const data = props.data

const fullName = computed(() => [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' '))

function onInput<K extends keyof W9Data>(key: K, value: W9Data[K]) {
  emit('update:data', { ...data, [key]: value })
}
</script>
