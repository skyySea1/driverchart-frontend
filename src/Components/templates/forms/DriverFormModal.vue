<template>
  <!-- todo update modal title based on driver presence and add validation for existing drivers -->
  <BaseModal
    v-cursor
    :isOpen="true"
    :title="props.driver ? 'Edit Driver' : 'New Driver'"
    size="w-full md:w-3/4 lg:w-2/3 xl:w-1/2"
    @close="handleClose"
  >
    <BaseAlert
      v-if="errorMsg"
      type="error"
      title="Error"
      :message="errorMsg"
      @close="errorMsg = ''"
      class="mb-4"
    />

    <!-- Hidden File Input for Compliance Docs -->
    <input
      ref="complianceFileInput"
      type="file"
      class="hidden"
      accept=".pdf,.jpg,.png,.jpeg"
      @change="onComplianceFileSelected"
    />

    <!-- 1. PERSONAL INFO -->
    <form novalidate @submit.prevent="save" class="space-y-3">
      <div>
        <div id="formTitle" class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
          <User class="w-5 h-5 text-slate-500" />
          <h3 class="font-bold text-slate-700">Personal Information</h3>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >First Name <span class="text-red-500">*</span></label
            >
            <input id="firstNameInput" v-model.trim="form.firstName" required class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Middle Name</label>
            <input id="middleNameInput" v-model.trim="form.middleName" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Last Name <span class="text-red-500">*</span></label
            >
            <input id="lastNameInput" v-model.trim="form.lastName" required class="input-base" />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Date of Birth <span class="text-red-500">*</span></label
            >
            <input id="dobInput" v-model="form.dob" type="date" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Phone Number <span class="text-red-500">*</span></label
            >
            <input
              id="phoneInput"
              v-model.trim="form.phone"
              type="tel"
              class="input-base"
              placeholder="(123) 456-7890"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700"
              >Email Address <span class="text-red-500">*</span>
            </label>
            <input id="emailInput" v-model.trim="form.email" type="email" class="input-base" />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Street Address</label>
            <input v-model.trim="form.address" placeholder="123 Main St" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">City</label>
            <input v-model.trim="form.city" placeholder="Orlando" class="input-base" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">State</label>
              <input v-model.trim="form.state" placeholder="FL" class="input-base" />
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Zip</label>
              <input v-model.trim="form.zip" placeholder="32801" class="input-base" />
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
            <input v-model.trim="form.bankName" placeholder="e.g. Chase" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Routing Number</label>
            <input v-model.trim="form.routingNumber" placeholder="9 Digits" class="input-base" />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Account Number</label>
            <input v-model.trim="form.accountNumber" placeholder="Account #" class="input-base" />
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
          class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Contact Name</label>
            <input
              v-model.trim="form.emergencyContact.name"
              placeholder="Joana Smith"
              class="input-base"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Relationship</label>
            <input
              v-model.trim="form.emergencyContact.relationship"
              placeholder="Wife"
              class="input-base"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Phone Number</label>
            <input
              v-model.trim="form.emergencyContact.phone"
              type="tel"
              class="input-base"
              placeholder="(123) 456-7890"
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
        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200"
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
            <div class="flex items-center gap-1">
              <label class="block text-xs font-bold text-slate-700">Termination Date</label>
              <!-- Tooltip -->
              <div class="group relative flex items-center">
                <HelpCircle class="w-3 h-3 text-slate-400 cursor-help" />
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-10 text-center pointer-events-none"
                >
                  Add termination date to change status
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"
                  ></div>
                </div>
              </div>
            </div>
            <input
              v-model="form.terminationDate"
              type="date"
              class="input-base"
              :class="{ 'border-orange-400': form.terminationDate }"
            />
            <p v-if="form.terminationDate" class="text-[10px] text-orange-600 mt-1">
              ⚠️ Status locked to Terminated/Rehired
            </p>
          </div>

          <div class="space-y-1" v-if="form.hireStatus === 'Rehired'">
            <label class="block text-xs font-bold text-slate-700"
              >Rehire Date <span class="text-red-500">*</span></label
            >
            <!-- Note: rehireDate is not in the shared schema, so we handle it carefully or assume it's part of a future update.
                 For now, keeping it but it might not persist to backend if not in schema. -->
            <input
              id="rehireDateInput"
              type="date"
              class="input-base"
              :required="form.hireStatus === 'Rehired'"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Current Status</label>
            <select
              v-model="form.hireStatus"
              class="input-base"
              :class="{ 'bg-orange-50': form.terminationDate }"
            >
              <option
                v-for="option in availableStatusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p
              v-if="!form.terminationDate"
              class="text-[10px] flex font-semibold text-slate-500 mt-1"
            >
              💡 Add termination date to change status
            </p>
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
          class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <div>
            <InputGroup
              label="Social Security Number (SSN)"
              placeholder="XXX-XX-XXXX"
              v-model.trim="form.ssnNumber"
              required
            />
            <FileInput
              label="Upload SSN Card"
              :fileName="form.ssnDocName"
              @change="(event: Event) => handleFileChange('ssnDocFile', event)"
            />
          </div>

          <div class="flex justify-end mt-2 md:flex-row gap-4">
            <button
              v-cursor
              type="button"
              @click="activeDocument = 'w9'"
              class="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group flex-1 max-w-xs"
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
      </div>

      <!-- 6. COMPLIANCE & QUALIFICATIONS -->
      <div class="flex items-center mb-2 gap-1 pb-1 border-b border-slate-200">
        <ShieldAlert class="w-5 h-5 text-slate-500" />
        <h3 class="font-bold text-slate-700">Compliance & Qualifications</h3>
      </div>
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="space-y-4">
          <!-- license -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-3 flex items-center gap-3">
              <div class="p-2 bg-white rounded shadow-sm text-slate-500">
                <CreditCard class="w-5 h-5" />
              </div>
              <div class="text-sm font-bold text-slate-700">License Information</div>
            </div>
            <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex space-x-2 col-span-2">
                <div class="flex-1 space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500"
                    >Number <span class="text-red-500">*</span></label
                  >
                  <input v-model.trim="form.license.documentNumber" class="input-base" />
                </div>
                <div class="w-20 space-y-1">
                  <label class="block text-[10px] font-bold text-slate-500"
                    >State <span class="text-red-500">*</span></label
                  >
                  <input v-model.trim="form.license.state" placeholder="FL" class="input-base" />
                </div>
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Expiration <span class="text-red-500">*</span></label
                >
                <div class="flex items-center gap-1">
                  <input v-model="form.license.expiryDate" type="date" class="input-base w-34" />
                  <ActionIcon
                    :icon="Upload"
                    variant="default"
                    title="Upload Certificate"
                    :status="uploadStatus.license"
                    @click="triggerUpload('license')"
                  />

                </div>
                <div v-if="form.license.file" class="flex items-center gap-1 text-[9px] text-green-600 mt-1">
                  <CheckCircle class="w-3 h-3" />
                  <span class="truncate max-w-37.5" :title="form.license.file">Document Uploaded</span>
                </div>
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
                <input v-model.trim="form.medical.registry" class="input-base" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Expiration <span class="text-red-500">*</span></label
                >
                <div class="flex items-center gap-1">
                  <input v-model="form.medical.expiryDate" type="date" class="input-base w-34" />
                  <ActionIcon
                    :icon="Upload"
                    variant="default"
                    title="Upload Certificate"
                    :status="uploadStatus.medical"
                    @click="triggerUpload('medical')"
                  />

                </div>
                <div v-if="form.medical.file" class="flex items-center gap-1 text-[9px] text-green-600 mt-1">
                  <CheckCircle class="w-3 h-3" />
                  <span class="truncate max-w-37.5" :title="form.medical.file">Document Uploaded</span>
                </div>
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
                <div class="flex items-center gap-1">
                  <input v-model="form.mvr.expiryDate" type="date" class="input-base w-34" />
                  <ActionIcon
                    :icon="Upload"
                    variant="default"
                    title="Upload Certificate"
                    :status="uploadStatus.mvr"
                    @click="triggerUpload('mvr')"
                  />

                </div>
                <div v-if="form.mvr.file" class="flex items-center gap-1 text-[9px] text-green-600 mt-1">
                  <CheckCircle class="w-3 h-3" />
                  <span class="truncate max-w-37.5" :title="form.mvr.file">Document Uploaded</span>
                </div>
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
                <div class="flex items-center gap-1">
                  <input
                    v-model="form.drugAlcohol.expiryDate"
                    type="date"
                    class="input-base w-34"
                  />
                  <ActionIcon
                    :icon="Upload"
                    variant="default"
                    title="Upload Certificate"
                    :status="uploadStatus.drugAlcohol"
                    @click="triggerUpload('drugAlcohol')"
                  />
                </div>
                <div v-if="form.drugAlcohol.file" class="flex items-center gap-1 text-[9px] text-green-600 mt-1">
                  <CheckCircle class="w-3 h-3" />
                  <span class="truncate max-w-37.5" :title="form.drugAlcohol.file">Document Uploaded</span>
                </div>
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
                <input v-model.trim="form.roadTest.examiner" class="input-base" />
              </div>
              <div class="space-y-1 relative">
                <label class="block text-[10px] font-bold text-slate-500"
                  >Date of Test <span class="text-red-500">*</span></label
                >
                <div class="flex items-center gap-1">
                  <input v-model="form.roadTest.date" type="date" class="input-base w-34" />
                  <ActionIcon
                    :icon="Upload"
                    variant="default"
                    title="Upload Certificate"
                    :status="uploadStatus.roadTest"
                    @click="triggerUpload('roadTest')"
                  />

                </div>
                <div v-if="form.roadTest.file" class="flex items-center gap-1 text-[9px] text-green-600 mt-1">
                  <CheckCircle class="w-3 h-3" />
                  <span class="truncate max-w-37.5" :title="form.roadTest.file">Document Uploaded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- TODO componentize buttons -->
      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-6">
        <button
          v-cursor
          type="button"
          @click="handleClose"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          v-cursor
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center shadow-sm shadow-blue-200 btn-up-hover-effect"
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
        <FormW9 :data="form" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'i9'">
        <FormI9 :data="form" @update:data="updateForm" />
      </div>
      <div v-else-if="activeDocument === 'roadtest'">
        <!-- The form is now perfectly compatible with RoadTestCertificate -->
        <RoadTestCertificate :driver="form" />
      </div>
    </BaseModal>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { dataService } from '@/services/dataService'
import { useDashboard } from '@/Composables/useDashboard'
import type { Driver, DriverForm, ComplianceItem } from '@/types'
import { sanitizeInput, capitalizeName } from '@/utils/utils'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import BaseModal from '@/Components/ui/BaseModal.vue'
import FormW9 from '@/Components/templates/forms/FormW9.vue'
import FormI9 from '@/Components/templates/forms/FormI9.vue'
import RoadTestCertificate from '@/Components/templates/RoadTestCertificate.vue'
import InputGroup from '@/Components/ui/InputGroup.vue'
import FileInput from '@/Components/ui/FileInput.vue'
import ActionIcon from '@/Components/ui/ActionIcon.vue'
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

  Upload,
  Phone,
  Save,
  HelpCircle,
} from 'lucide-vue-next'
import { DriverFormSchema } from '@/schemas/driverSchema'

const props = defineProps<{ driver?: Driver }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const isSaving = ref(false)
const errorMsg = ref('')
const activeDocument = ref<string | null>(null)

// Ref for the hidden file input
const complianceFileInput = ref<HTMLInputElement | null>(null)
// Track which document is being uploaded (license, medical, etc.)
const activeUploadDocType = ref<string | null>(null)
// Backward-compatible alias; prefer `activeUploadDocType` in new code
const uploadingDocType = activeUploadDocType

const isDirty = ref(false)
const isInitialized = ref(false)

// Track upload status per document type
const uploadStatus = ref<Record<string, 'idle' | 'loading' | 'success'>>({
  license: 'idle',
  medical: 'idle',
  mvr: 'idle',
  drugAlcohol: 'idle',
  roadTest: 'idle',
})

// Initialize form with default nested structure from the Schema logic
const form = ref<DriverForm>({
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  email: '',
  phone: '',
  ssnNumber: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  hireStatus: 'Active',
  hireDate: '',
  terminationDate: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
  license: {
    documentNumber: '',
    state: '',
    expiryDate: '',
    value: '',
  },
  medical: {
    documentNumber: '',
    expiryDate: '',
    registry: '',
  },
  mvr: {
    documentNumber: '',
    expiryDate: '',
  },
  drugAlcohol: {
    documentNumber: '',
    expiryDate: '',
  },
  roadTest: {
    documentNumber: '',
    examiner: '',
    date: '',
    expiryDate: '',
  },
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  w9Signed: false,
  businessName: '',
  taxClassification: 'individual',
  i9EmployerSignature: '',
  ssnDocName: '',
  ssnDocFile: null,
  ssnDocPreviewUrl: '',
  id: '',
})

onMounted(() => {
  if (props.driver) {
    form.value = {
      ...form.value,
      ...props.driver,
      // Capitalize for UI
      firstName: capitalizeName(props.driver.firstName || ''),
      middleName: capitalizeName(props.driver.middleName || ''),
      lastName: capitalizeName(props.driver.lastName || ''),
      address: capitalizeName(props.driver.address || ''),
      city: capitalizeName(props.driver.city || ''),
      bankName: capitalizeName(props.driver.bankName || ''),
      businessName: capitalizeName(props.driver.businessName || ''),

      license: { ...form.value.license, ...props.driver.license },
      medical: { ...form.value.medical, ...props.driver.medical },
      mvr: { ...form.value.mvr, ...props.driver.mvr },
      drugAlcohol: { ...form.value.drugAlcohol, ...props.driver.drugAlcohol },
      roadTest: {
        ...form.value.roadTest,
        ...props.driver.roadTest,
        examiner: capitalizeName(props.driver.roadTest?.examiner || ''),
      },
      emergencyContact: {
        ...form.value.emergencyContact,
        ...props.driver.emergencyContact,
        name: capitalizeName(props.driver.emergencyContact?.name || ''),
        relationship: capitalizeName(props.driver.emergencyContact?.relationship || ''),
      },
    }
  }
  // Allow watchers to settle before tracking dirty state
  setTimeout(() => {
    isInitialized.value = true
  }, 100)
})
// Watch for changes for Dirty State
watch(
  form,
  () => {
    if (isInitialized.value) {
      isDirty.value = true
    }
  },
  { deep: true },
)

const availableStatusOptions = computed(() => {
  if (form.value.terminationDate) {
    return [
      { value: 'Terminated', label: 'Terminated' },
      { value: 'Rehired', label: 'Rehired' },
    ]
  }
  return [{ value: 'Active', label: 'Active' }]
})

watch(
  () => form.value.terminationDate,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      form.value.hireStatus = 'Terminated'
    } else if (!newVal && oldVal) {
      form.value.hireStatus = 'Active'
    }
  },
)

watch(
  () => form.value.hireStatus,
  (newVal, oldVal) => {
    if (oldVal === 'Terminated' && newVal === 'Active') {
      form.value.terminationDate = ''
    }
  },
)

const activeDocumentTitle = computed(() => {
  if (activeDocument.value === 'w9') return 'Form W-9 (Request for Taxpayer ID)'
  if (activeDocument.value === 'i9') return 'Form I-9 (Employment Eligibility)'
  if (activeDocument.value === 'roadtest') return 'Road Test Certification'
  return ''
})

function updateForm(newData: Partial<typeof form.value>) {
  form.value = { ...form.value, ...newData }
}

async function handleFileChange(fieldName: 'ssnDocFile', event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    console.warn('Event target is not an HTMLInputElement:', event.target)
    return
  }
  const target = event.target
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validate Driver Context existence (ID or Name)
    if (!form.value.id && (!form.value.firstName || !form.value.lastName)) {
      errorMsg.value = 'Please fill in the driver\'s first and last name before uploading documents.'
      target.value = '' // Reset input
      return
    }

    if (fieldName === 'ssnDocFile') {
      try {
        const driverName = `${form.value.firstName} ${form.value.lastName}`
        const today = new Date().toISOString()

        // Optimistic UI update for preview (optional)
        form.value.ssnDocPreviewUrl = URL.createObjectURL(file)

        // Real Upload
        const { url, filename } = await dataService.uploadDocument(
          form.value.id || null,
          'ssnDoc',
          file,
          today,
          driverName,
          undefined,
          !form.value.id ? driverName : undefined
        )

        form.value.ssnDocName = filename
        form.value.ssnDoc = url
      } catch (e) {
        console.error('SSN Upload failed', e)
        errorMsg.value = 'Failed to upload SSN Card.'
      }
    }
  }
}

// Compliance File Upload Logic
function triggerUpload(docType: string) {
  uploadingDocType.value = docType
  complianceFileInput.value?.click()
}

async function onComplianceFileSelected(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return
  const target = event.target
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const docType = uploadingDocType.value

    if (docType) {
      if (['license', 'medical', 'mvr', 'drugAlcohol', 'roadTest'].includes(docType)) {
        if (!form.value.id && (!form.value.firstName || !form.value.lastName)) {
          errorMsg.value = 'Please fill in the driver\'s first and last name before uploading documents.'
          target.value = ''
          uploadingDocType.value = null
          return
        }

        const item = form.value[docType as keyof DriverForm] as ComplianceItem
        if (item) {
          uploadStatus.value[docType] = 'loading'
          try {
            const driverName = `${form.value.firstName} ${form.value.lastName}`
            const today = new Date().toISOString()

            const { url } = await dataService.uploadDocument(
              form.value.id || null,
              docType,
              file,
              today,
              driverName,
              item.expiryDate,
              !form.value.id ? driverName : undefined
            )

            item.file = url
            uploadStatus.value[docType] = 'success'
          } catch (e) {
            console.error('Upload failed', e)
            uploadStatus.value[docType] = 'idle'
            errorMsg.value = 'Failed to upload document.'
          }
        }
      }
    }
  }
  target.value = ''
  uploadingDocType.value = null
}

function handleClose() {
  if (isDirty.value) {
    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
      emit('close')
    }
  } else {
    emit('close')
  }
}

async function save() {
  try {
    errorMsg.value = ''

    const validationResult = DriverFormSchema.safeParse(form.value)

    if (!validationResult.success) {
      const issues = validationResult.error.issues
      if (issues && issues.length > 0) {
        const firstError = issues[0]
        if (firstError && firstError.message) {
          errorMsg.value = firstError.message
        } else {
          errorMsg.value = 'Validation failed with unknown error.'
        }
        const path = firstError && firstError.path ? firstError.path.join('.') : ''
        if (path) {
          console.warn('Validation error at:', path)
        }
      } else {
        errorMsg.value = 'Validation failed with unknown error.'
      }
      return
    }

    isSaving.value = true

    const firstName = sanitizeInput(form.value.firstName)
    const middleName = sanitizeInput(form.value.middleName)
    const lastName = sanitizeInput(form.value.lastName)

    const dataToSave: Driver = {
      ...form.value,
      firstName,
      middleName,
      lastName,
      license: {
        ...form.value.license,
        state: form.value.license.state.toUpperCase(),
      },
      id: props.driver?.id || '',
    }

    const finalData = { ...dataToSave }
    delete finalData.ssnDocFile
    delete finalData.ssnDocPreviewUrl

    if (props.driver?.id) {
      await dataService.updateDriver({ ...finalData, id: props.driver.id })
    } else {
      await dataService.addDriver({ ...finalData })
    }

    useDashboard().fetchDashboardStats(true)

    emit('saved')
    emit('close')
  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred.'
    if (err instanceof Error) {
      errorMessage = err.message
    } else if (typeof err === 'string') {
      errorMessage = err
    }
    errorMsg.value = errorMessage || 'Error saving driver'
    console.error('Save error:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
