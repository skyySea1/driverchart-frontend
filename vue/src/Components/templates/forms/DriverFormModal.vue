<template>
  <!-- todo update modal title based on driver presence and add validation for existing drivers -->
  <BaseModal
    v-cursor
    :isOpen="true"
    :title="props.driver ? 'Edit Driver' : 'New Driver'"
    size="w-full md:w-3/4 lg:w-2/3 xl:w-1/2"
    @close="$emit('close')"
  >
    <BaseAlert
      v-if="errorMsg"
      type="error"
      title="Error"
      :message="errorMsg"
      @close="errorMsg = ''"
      class="mb-4"
    />

    <!-- 1. PERSONAL INFO -->
    <form novalidate @submit.prevent="save" class="space-y-3">
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <User class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Personal Information</h3>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >First Name <span class="text-red-500">*</span></label
            >
            <input id="firstNameInput" v-model="form.firstName" required class="input-base" />
          </div>
          <!-- todo migrate from primaryinput component -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Middle Name</label>
            <input id="middleNameInput" v-model="form.middleName" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Last Name <span class="text-red-500">*</span></label
            >
            <input id="lastNameInput" v-model="form.lastName" required class="input-base" />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Date of Birth <span class="text-red-500">*</span></label
            >
            <input id="birthDateInput" v-model="form.birthDate" type="date" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Phone Number <span class="text-red-500">*</span></label
            >
            <input id="phoneInput" v-model="form.phone" type="tel" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700"
              >Email Address <span class="text-red-500">*</span>
            </label>
            <input id="emailInput" v-model="form.email" type="email" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700">Street Address</label>
            <input v-model="form.address" placeholder="123 Main St" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700">City</label>
            <input v-model="form.city" placeholder="Orlando" class="input-base" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-700">State</label>
              <input v-model="form.state" placeholder="FL" class="input-base" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-700">Zip</label>
              <input v-model="form.zip" placeholder="32801" class="input-base" />
            </div>
          </div>
        </div>
      </div>

      <!--2. BANKING INFO -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <BadgeDollarSign class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-x text-slate-700">Banking & Payroll Information</h3>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Bank Name</label>
            <input v-model="form.bankName" placeholder="e.g. Chase" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Routing Number</label>
            <input v-model="form.routingNumber" placeholder="9 Digits" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Account Number</label>
            <input v-model="form.accountNumber" placeholder="Account #" class="input-base" />
          </div>
        </div>
      </div>

      <!-- 3. EMERGENCY CONTACT -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <Phone class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Emergency Contact</h3>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Contact Name</label>
            <input v-model="form.emergencyName" placeholder="Joana Smith" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Relationship</label>
            <input v-model="form.emergencyRelationship" placeholder="Wife" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Phone Number</label>
            <input v-model="form.emergencyPhone" type="tel" class="input-base" />
          </div>
        </div>
      </div>

      <!-- 4. EMPLOYMENT STATUS -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <Users class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Employment Status</h3>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Hire Date <span class="text-red-500">*</span></label
            >
            <input
              id="hireDateInput"
              v-model="form.hireDate"
              type="date"
              required
              class="input-base"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Termination Date</label>
            <input v-model="form.termDate" type="date" class="input-base" />
          </div>
          <div class="space-y-1" v-if="form.hireStatus === 'Rehired'">
            <label class="block text-xs font-bold text-slate-700"
              >Rehire Date <span class="text-red-500">*</span></label
            >
            <input id="rehireDateInput" v-model="form.rehireDate" type="date" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Current Status</label>
            <select v-model="form.hireStatus" class="input-base">
              <option value="Active">Active</option>
              <option value="Terminated">Terminated</option>
              <option value="Rehired">Rehired</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 5. LEGAL & TAX FORMS -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <Building class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Legal & Tax Forms (USCIS / IRS)</h3>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div>
            <InputGroup
              label="Social Security (SSN)"
              placeholder="XXX-XX-XXXX"
              v-model="form.ssn"
            />
            <FileInput
              label="Upload SSN Card"
              :fileName="form.ssnDocName"
              @change="(event: Event) => handleFileChange('ssnDoc', event)"
            />
          </div>

          <div class="flex justify-end mt-2 md:flex-row gap-4">
            <button
              v-cursor
              type="button"
              @click="activeDocument = 'w9'"
              class="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group flex-1 max-w-xs"
            >
              <PenTool class="w-5 h-5 text-slate-400 group-hover:text-purple-600 mb-1" />
              <span class="font-bold text-sm text-slate-700">Form W-9</span>
              <span class="text-[10px] text-slate-400">Taxpayer ID & Cert</span>
              <span
                v-if="form.w9Signed"
                class="mt-1 inline-flex items-center text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full"
              >
                <CheckCircle class="w-3 h-3 mr-1" /> Signed
              </span>
            </button>

            <button
              v-cursor
              type="button"
              @click="activeDocument = 'i9'"
              class="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group flex-1"
            >
              <PenTool class="w-6 h-6 text-slate-400 group-hover:text-purple-600 mb-1" />
              <span class="font-bold text-sm text-slate-700">Form I-9</span>
              <span class="text-[10px] text-slate-400">Employment Eligibility</span>
              <span
                v-if="form.i9EmployerSignature"
                class="mt-1 inline-flex items-center text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full"
              >
                <CheckCircle class="w-3 h-3 mr-1" /> Verified
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 6. COMPLIANCE & QUALIFICATIONS -->
      <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
        <ShieldAlert class="w-5 h-5 text-slate-500" />
        <h3 class="font-bold text-slate-700">Compliance & Qualifications</h3>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="space-y-4">
          <!-- CDL -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-slate-500">
                <CreditCard class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">CDL Information</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex space-x-2 col-span-2">
                <div class="flex-1 space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500"
                    >Number <span class="text-red-500">*</span></label
                  >
                  <input v-model="form.cdlNumber" class="input-base" />
                </div>
                <div class="w-20 space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500"
                    >State <span class="text-red-500">*</span></label
                  >
                  <input v-model="form.cdlState" placeholder="FL" class="input-base" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Expiration <span class="text-red-500">*</span></label
                >
                <input v-model="form.cdlExp" type="date" class="input-base" />
              </div>
            </div>
          </div>

          <!-- Medical -->
          <div
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-t border-slate-200 pt-4"
          >
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-rose-500">
                <Stethoscope class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">Medical Cert (MEC)</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-2 space-y-1">
                <label class="block text-[10px] font-bold text-slate-500">Registry Number</label>
                <input v-model="form.medRegistry" class="input-base" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Expiration <span class="text-red-500">*</span></label
                >
                <input v-model="form.medExp" type="date" class="input-base" />
              </div>
            </div>
          </div>

          <!-- MVR -->
          <div
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-t border-slate-200 pt-4"
          >
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-purple-600">
                <ClipboardList class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">MVR (Annual)</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-2">
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1"
                  >Interval</label
                >
                <div class="text-sm text-slate-500 py-1.5">Every 12 Months</div>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Review Date <span class="text-red-500">*</span></label
                >
                <input v-model="form.mvrDate" type="date" class="input-base" />
              </div>
            </div>
          </div>

          <!-- Drug & Alcohol -->
          <div
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-t border-slate-200 pt-4"
          >
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-blue-600">
                <FlaskConical class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">Drug & Alcohol</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-2">
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1"
                  >Test Type</label
                >
                <div class="text-sm text-slate-500 py-1.5">Clearinghouse Query</div>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Last Query Date <span class="text-red-500">*</span></label
                >
                <input v-model="form.lastDrugTest" type="date" class="input-base" />
              </div>
            </div>
          </div>

          <!-- Road Test -->
          <div
            class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-t border-slate-200 pt-4"
          >
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-orange-600">
                <Map class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">Road Test (Cert)</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-2 space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Examiner Name <span class="text-red-500">*</span></label
                >
                <input v-model="form.roadTestExaminer" class="input-base" />
              </div>
              <div class="space-y-1 relative">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Date of Test <span class="text-red-500">*</span></label
                >
                <input v-model="form.roadTestDate" type="date" class="input-base" />

                <div class="absolute -top-1 right-0 flex space-x-1">
                  <button
                    v-cursor
                    type="button"
                    @click="activeDocument = 'roadtest'"
                    class="p-1 rounded bg-slate-200 hover:bg-blue-100 text-slate-600"
                    title="Download Certificate"
                  >
                    <Download class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-cursor
                    type="button"
                    @click="activeDocument = 'roadtest'"
                    class="p-1 rounded bg-slate-200 hover:bg-blue-100 text-slate-600"
                    title="Print Certificate"
                  >
                    <Printer class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
        <button
          v-cursor
          type="button"
          @click="$emit('close')"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          v-cursor
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center shadow-sm shadow-blue-200 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ props.driver ? 'Update Driver File' : 'Save New Driver' }}
        </button>
      </div>
    </form>

    <!-- Sub-Modals for Documents -->
    <BaseModal
      :isOpen="!!activeDocument"
      :title="activeDocumentTitle"
      size="max-w-4xl"
      @close="activeDocument = null"
    >
      <div v-if="activeDocument === 'w9'">
        <FormW9 :data="form as any" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'i9'">
        <FormI9 :data="form as any" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'roadtest'">
        <!-- Using the original certificate component structure but passing flat form data -->
        <!-- Note: The original certificate expects nested objects, but we flattened the form. -->
        <RoadTestCertificate :driver="formattedForCertificate" />
      </div>
    </BaseModal>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { dataService } from '@/services/dataService'
import type { Driver } from '@/types'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import BaseModal from '@/Components/ui/BaseModal.vue'
import FormW9 from '@/Components/ui/FormW9.vue'
import FormI9 from '@/Components/ui/FormI9.vue'
import RoadTestCertificate from '@/Components/templates/RoadTestCertificate.vue'
import InputGroup from '@/Components/ui/InputGroup.vue'
import FileInput from '@/Components/ui/FileInput.vue'
import {
  User,
  Users,
  Building,
  PenTool,
  CheckCircle,
  BadgeDollarSign,
  ShieldAlert,
  CreditCard,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Map,
  Printer,
  Download,
  Phone,
  Save,
  Compass,
} from 'lucide-vue-next'

const props = defineProps<{ driver?: Driver }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const isSaving = ref(false)
const errorMsg = ref('')
const activeDocument = ref<string | null>(null)

// form states - internal flattened structure
const form = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  hireStatus: 'Active',
  hireDate: '',
  termDate: '',
  rehireDate: '',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelationship: '',
  cdlNumber: '',
  cdlState: '',
  cdlExp: '',
  medRegistry: '',
  medExp: '',
  mvrDate: '',
  lastDrugTest: '',
  roadTestDate: '',
  roadTestExaminer: '',
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  w9Signed: false,
  businessName: '',
  taxClassification: 'individual',
  i9EmployerSignature: '',
  ssnDocName: '',
  ssnDocFile: null as File | null,
  ssnDocPreviewUrl: '',
})

onMounted(() => {
  if (props.driver) {
    // Map nested to flat
    form.value = {
      ...form.value,
      ...props.driver,
      birthDate: props.driver.dob || '',
      address: props.driver.address || '',
      city: props.driver.city || '',
      state: props.driver.state || '',
      zip: props.driver.zip || '',
      cdlNumber: props.driver.cdl?.documentNumber || '',
      cdlState: props.driver.cdl?.state || '',
      cdlExp: props.driver.cdl?.expiryDate || '',
      medRegistry: props.driver.medical?.registry || '',
      medExp: props.driver.medical?.expiryDate || '',
      mvrDate: props.driver.mvr?.expiryDate || '',
      lastDrugTest: props.driver.drugAlcohol?.expiryDate || '',
      roadTestDate: props.driver.roadTest?.date || '',
      roadTestExaminer: props.driver.roadTest?.examiner || '',
      emergencyName: props.driver.emergencyContact?.name || '',
      emergencyPhone: props.driver.emergencyContact?.phone || '',
      emergencyRelationship: props.driver.emergencyContact?.relationship || '',
    }
  }
})

const activeDocumentTitle = computed(() => {
  if (activeDocument.value === 'w9') return 'Form W-9 (Request for Taxpayer ID)'
  if (activeDocument.value === 'i9') return 'Form I-9 (Employment Eligibility)'
  if (activeDocument.value === 'roadtest') return 'Road Test Certification'
  return ''
})

function updateForm(newData: Partial<typeof form.value>) {
  form.value = { ...form.value, ...newData }
}

const formattedForCertificate = computed(() => {
  return {
    ...form.value,
    roadTest: {
      examiner: form.value.roadTestExaminer,
      date: form.value.roadTestDate,
      expiryDate: '',
    },
    cdl: {
      documentNumber: form.value.cdlNumber,
      state: form.value.cdlState,
    },
  } as any
})

function handleFileChange(fieldName: 'ssnDoc', event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (fieldName === 'ssnDoc') {
      form.value.ssnDocPreviewUrl = URL.createObjectURL(file)
      form.value.ssnDocName = file.name
      form.value.ssnDocFile = file
    }
  }
}

async function save() {
  try {
    errorMsg.value = ''
    let errorFieldId = ''

    if (!form.value.firstName?.trim()) {
      errorMsg.value = 'First Name is required.'
      errorFieldId = 'firstNameInput'
    } else if (!form.value.lastName?.trim()) {
      errorMsg.value = 'Last Name is required.'
      errorFieldId = 'lastNameInput'
    } else if (!form.value.birthDate) {
      errorMsg.value = 'Date of Birth is required.'
      errorFieldId = 'birthDateInput'
    } else if (!form.value.phone?.trim()) {
      errorMsg.value = 'Phone Number is required.'
      errorFieldId = 'phoneInput'
    } else if (!form.value.hireDate) {
      errorMsg.value = 'Hire Date is required.'
      errorFieldId = 'hireDateInput'
    }

    if (errorMsg.value) {
      if (errorFieldId) {
        const element = document.getElementById(errorFieldId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      }
      return
    }

    isSaving.value = true

    // nested structure required by the API/Type
    const dataToSave: Driver = {
      ...(form.value as any),
      dob: form.value.birthDate,
      cdl: {
        documentNumber: form.value.cdlNumber,
        state: form.value.cdlState,
        expiryDate: form.value.cdlExp,
      },
      medical: {
        documentNumber: '',
        registry: form.value.medRegistry,
        expiryDate: form.value.medExp,
      },
      mvr: {
        documentNumber: '',
        expiryDate: form.value.mvrDate,
      },
      drugAlcohol: {
        documentNumber: '',
        expiryDate: form.value.lastDrugTest,
      },
      roadTest: {
        documentNumber: '',
        examiner: form.value.roadTestExaminer,
        date: form.value.roadTestDate,
      },
      emergencyContact: {
        name: form.value.emergencyName,
        phone: form.value.emergencyPhone,
        relationship: form.value.emergencyRelationship,
      },
    }

    // Remove internal UI-only fields before saving
    const finalData = { ...dataToSave } as any
    delete finalData.ssnDocFile
    delete finalData.ssnDocPreviewUrl

    if (props.driver?.id) {
      await dataService.updateDriver({ ...finalData, id: props.driver.id })
    } else {
      await dataService.addDriver({ ...finalData } as any)
    }
    emit('saved')
    emit('close')
  } catch (err) {
    const error = err as Error
    errorMsg.value = error.message || 'Error saving driver'
    console.error('Save error:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
