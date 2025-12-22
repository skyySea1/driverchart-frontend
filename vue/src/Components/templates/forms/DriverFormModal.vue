<template>
  <!-- todo update modal title based on driver presence and add validation for existing drivers -->
  <Modal
    v-cursor
    :isOpen="true"
    :title="driver ? 'Edit Driver' : 'New Driver'"
    size="w-full md:w-3/4 lg:w-2/3 xl:w-1/2"
    @close="$emit('close')"
  >
    <Alert
      v-if="errorMsg"
      type="error"
      title="Error"
      :message="errorMsg"
      @close="errorMsg = ''"
      class="mb-4"
    />

    <!-- 1. PERSONAL INFO -->
    <form novalidate @submit.prevent="save" class="space-y-6">
      <div>
        <div id="formTitle" class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <User class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Personal Information</h3>
        </div>
        <div
          class="grid grid-cols-3  gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >First Name <span class="text-red-500">*</span></label
            >
            <input
              id="firstNameInput"
              v-model="form.firstName"
              required
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Middle Name</label>
            <input
              v-model="form.middleName"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Last Name <span class="text-red-500">*</span></label
            >
            <input
              id="lastNameInput"
              v-model="form.lastName"
              required
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Date of Birth <span class="text-red-500">*</span></label>
            <input
              id="birthDateInput"
              v-model="form.birthDate"
              type="date"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Phone Number <span class="text-red-500">*</span></label>
            <input
              id="phoneInput"
              v-model="form.phone"
              type="tel"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Email Address <span class="text-red-500">*</span> </label>
            <input
              id="emailInput"
              v-model="form.email"
              type="email"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Bank Name</label>
            <input
              v-model="form.bankName"
              placeholder="e.g. Chase"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Routing Number</label>
            <input
              v-model="form.routingNumber"
              placeholder="9 Digits"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Account Number</label>
            <input
              v-model="form.accountNumber"
              placeholder="Account #"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <!-- 3. EMERGENCY CONTACT -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <Phone class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Emergency Contact</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Contact Name</label>
            <input
              v-model="form.emergencyName"
              placeholder="Joana Smith"
              class="w-full p-2 text-sm border bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Relationship</label>
            <input
              v-model="form.emergencyRel"
              placeholder="Wife"
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Phone Number</label>
            <input
              v-model="form.emergencyPhone"
              type="tel"
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <!-- 4. EMPLOYMENT STATUS -->
      <div>
        <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <Users class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Employment Status</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Hire Date <span class="text-red-500">*</span></label
            >
            <input
              id="hireDateInput"
              v-model="form.hireDate"
              type="date"
              required
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Termination Date</label>
            <input
              v-model="form.termDate"
              type="date"
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1" v-if="form.status === 'Rehired'">
            <label class="block text-xs font-bold text-slate-700">Rehire Date <span class="text-red-500">*</span></label>
            <input
              id="rehireDateInput"
              v-model="form.rehireDate"
              type="date"
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-400 uppercase">Current Status</label>
            <select
              v-model="form.status"
              class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
            >
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
        <div class="flex items-center  gap-1 pb-1 mb-2 border-b border-slate-200">
          <Building class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Legal & Tax Forms (USCIS / IRS)</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4  bg-slate-50 p-3 rounded-lg border border-slate-200">
             <InputGroup label="Social Security (SSN)" placeholder="XXX-XX-XXXX" v-model="form.ssn" />
             <FileInput label="Upload SSN Card" :fileName="form.ssnDocName" @change="(e) => handleFileChange('ssnDoc', e)" />
        </div>

        <div class="flex flex-col md:flex-row gap-4">
          <button
            v-cursor
            type="button"
            @click="activeDocument = 'w9'"
            class="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group flex-1"
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
            class="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group flex-1"
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

      <!-- 6. COMPLIANCE & QUALIFICATIONS -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <ShieldAlert class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Compliance & Qualifications</h3>
        </div>

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
                  <label class="block text-[10px] font-bold text-slate-500">Number <span class="text-red-500">*</span></label>
                  <input v-model="form.cdlNumber" class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all" />
                </div>
                <div class="w-20 space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500">State <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.cdlState"
                    placeholder="FL"
                    class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500">Expiration <span class="text-red-500">*</span></label>
                <input
                  v-model="form.cdlExp"
                  type="date"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />
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
                  <input v-model="form.medRegistry" class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500">Expiration <span class="text-red-500">*</span></label>
                <input
                  v-model="form.medExp"
                  type="date"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />
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
                <label class="block text-[10px] font-bold text-slate-500">Review Date <span class="text-red-500">*</span></label>
                <input
                  v-model="form.mvrDate"
                  type="date"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />
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
                <label class="block text-[10px] font-bold text-slate-500">Last Query Date <span class="text-red-500">*</span></label>
                <input
                  v-model="form.lastDrugTest"
                  type="date"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />
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
                <label class="block text-[10px] font-bold text-slate-500">Examiner Name <span class="text-red-500">*</span></label>
                <input
                  v-model="form.roadTestExaminer"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />
              </div>
              <div class="space-y-1 relative">
                <label class="block text-[10px] font-bold text-slate-500">Date of Test <span class="text-red-500">*</span></label>
                <input
                  v-model="form.roadTestDate"
                  type="date"
                  class="w-full text-sm border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-2 outline-none transition-all"
                />

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
          <Save class="w-4 h-4 mr-2" /> {{ driver ? 'Update Driver File' : 'Save New Driver' }}
        </button>
      </div>
    </form>

    <!-- Sub-Modals for Documents -->
    <Modal
      :isOpen="!!activeDocument"
      :title="activeDocumentTitle"
      size="max-w-4xl"
      @close="activeDocument = null"
    >
      <div v-if="activeDocument === 'w9'">
        <FormW9 :data="form" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'i9'">
        <FormI9 :data="form" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'roadtest'">
        <!-- Using the original certificate component structure but passing flat form data -->
        <!-- Note: The original certificate expects nested objects, but we flattened the form. -->
        <!-- We'll construct a compatible object on the fly or adjust the certificate later. -->
        <RoadTestCertificate :driver="formattedForCertificate" />
      </div>
    </Modal>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { dataService } from '@/services/dataService'
import type { Driver } from '@/types'
import Alert from '@/Components/ui/Alert.vue'
import Modal from '@/Components/ui/Modal.vue'
import FormW9 from '@/Components/ui/FormW9.vue'
import FormI9 from '@/Components/ui/FormI9.vue'
import RoadTestCertificate from '@/Components/templates/RoadTestCertificate.vue'
import InputGroup from '@/Components/ui/inputgroup.vue'
import FileInput from '@/Components/ui/fileinput.vue'
import {
  User,
  Users,
  Building,
  PenTool,
  CheckCircle,
  BadgeDollarSign,
  UploadCloud,
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
} from 'lucide-vue-next'

const props = defineProps<{ driver?: any }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const isSaving = ref(false)
const errorMsg = ref('')
const activeDocument = ref<string | null>(null)

// form states
const form = ref<any>({
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  ssn: '',
  ssnDoc: '',

  // Banking
  bankName: '',
  routingNumber: '',
  accountNumber: '',

  // Employment
  hireDate: '',
  termDate: '',
  rehireDate: '',
  status: 'Active',

  // Emergency
  emergencyName: '',
  emergencyPhone: '',
  emergencyRel: '',

  // Compliance
  cdlNumber: '',
  cdlState: '',
  cdlExp: '',
  cdlDoc: '',
  mvrDate: '',
  mvrDoc: '',
  medRegistry: '',
  medExp: '',
  medDoc: '',
  lastDrugTest: '',
  drugDoc: '',

  // Road Test
  roadTestDate: '',
  roadTestExaminer: '',
  roadTestDoc: '',

  // W9
  w9Address: '',
  w9CityStateZip: '',
  w9Signed: false,
  w9Signature: '',
  w9Date: '',
  businessName: '',
  taxClassification: 'individual',

  // I9 (Add fields as needed based on FormI9.vue)
  i9EmployerSignature: '',
})

onMounted(() => {
  if (props.driver) {
    // Merge existing driver data into form
    // We might need to map nested fields from the old structure if the DB has them nested
    // For now, assuming direct mapping or flat structure in DB
    form.value = { ...form.value, ...props.driver }

    // Legacy mapping if needed (e.g. if driver has nested cdl object)
    if (props.driver.cdl) {
      form.value.cdlNumber = props.driver.cdl.value
      form.value.cdlState = props.driver.cdl.state
      form.value.cdlExp = props.driver.cdl.expiryDate
    }
    // Add similar mappings for other nested objects if the DB schema is mixed
  }
})

// Computed for modal title
const activeDocumentTitle = computed(() => {
  if (activeDocument.value === 'w9') return 'Form W-9 (Request for Taxpayer ID)'
  if (activeDocument.value === 'i9') return 'Form I-9 (Employment Eligibility)'
  if (activeDocument.value === 'roadtest') return 'Road Test Certification'
  return ''
})

// Helper to update form from sub-components
function updateForm(newData: any) {
  form.value = { ...form.value, ...newData }
}

// Helper to format flat data back to nested structure for RoadTestCertificate
const formattedForCertificate = computed(() => {
  return {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    roadTest: {
      examiner: form.value.roadTestExaminer,
      date: form.value.roadTestDate,
      expiryDate: '', // logic for expiry?
    },
    cdl: {
      value: form.value.cdlNumber,
      state: form.value.cdlState,
    },
    ...form.value,
  }
})

// Helper to handle file selection for FileInput components
function handleFileChange(fieldName: string, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // In a real app, you would upload the file here and get a URL
    // For now, we'll simulate it by storing the file name
    if (fieldName === 'ssnDoc') {
      const previousUrl = form.value.ssnDoc
      if (previousUrl) {
        try {
          URL.revokeObjectURL(previousUrl as string)
        } catch (e) {
          // Ignore errors in case the stored value is not an object URL
        }
      }
      form.value.ssnDoc = URL.createObjectURL(file) // Simulating a URL
      form.value.ssnDocName = file.name // Store name for display
    }
    // Add logic for other file fields if needed
  }
}

// Validation logic handled in save()


async function save() {
  try {
    errorMsg.value = ''
    let errorFieldId = ''

    // Validation
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
      errorFieldId = 'hireDateInput' // Need to add this ID to template if missing
    } else if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errorMsg.value = 'Please enter a valid email address.'
      errorFieldId = 'emailInput'
    }

    if (errorMsg.value) {
      // Scroll to error field
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

    // Prepare data to save - handling legacy nested structure vs flat structure
    // We'll save flat structure as primary, but maybe keep some nested for backward compatibility if other views depend on it
    // For this refactor, we'll try to save both or transition to flat.
    // Let's constructing the nested objects that other views might expect:
    const dataToSave = {
      ...form.value,
      // Re-construct nested objects for compatibility with DefaultTable and other views
      cdl: {
        value: form.value.cdlNumber,
        state: form.value.cdlState,
        expiryDate: form.value.cdlExp,
      },
      medical: { registry: form.value.medRegistry, expiryDate: form.value.medExp },
      mvr: { expiryDate: form.value.mvrDate },
      drugAlcohol: { expiryDate: form.value.lastDrugTest }, // Mapped for clearinghouse
      roadTest: { examiner: form.value.roadTestExaminer, date: form.value.roadTestDate },
      updatedAt: new Date().toISOString(),
    }

    if (props.driver?.id) {
      await dataService.updateDriver({ id: props.driver.id, ...dataToSave })
    } else {
      await dataService.addDriver({ ...dataToSave, createdAt: new Date().toISOString() })
    }
    emit('saved')
    emit('close')
  } catch (err: any) {
    errorMsg.value = err.message || 'Error saving driver'
    console.error('Save error:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
