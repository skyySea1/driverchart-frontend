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
      <BaseButton
        label="Back to Applicants"
        :icon="ArrowLeft"
        :variant="'blue'"
        @click="$router.back()"
        class="text-sm font-medium shadow-sm"
      />

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="flex-1 w-full">
          <!-- Flag Alert Banner -->
          <div
            v-if="applicant.isFlagged"
            class="mb-4 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm border-l-4 border-l-red-600"
          >
            <div class="flex items-center gap-2 text-slate-800 text-sm">
              <div class="bg-red-600 rounded-full p-1.5 shadow-sm">
                <Flag class="w-3.5 h-3.5 text-white" fill="currentColor" />
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-black text-slate-900 border-r border-slate-200 pr-1.5 mr-0.5"
                  >{{ dayjs(applicant.flagDate).format('MM/DD/YYYY') }}:</span
                >
                <span class="text-slate-600 font-medium">{{ applicant.flagReason }}</span>
              </div>
            </div>
            <button
              @click="clearFlag"
              class="text-[11px] font-black text-slate-800 hover:text-red-700 underline underline-offset-2 transition-all cursor-pointer mr-2"
            >
              CLEAR FLAG
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200 uppercase"
            >
              {{ applicant.personalInfo.firstName[0] }}{{ applicant.personalInfo.lastName[0] }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                {{ capitalizeName(applicant.personalInfo.firstName) }}
                {{ capitalizeName(applicant.personalInfo.lastName) }}
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
              <!-- Quick Actions Row -->
              <div
                class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-slate-100 text-[13px] font-semibold"
              >
                <button
                  v-cursor
                  @click="handleAction('send_policy')"
                  class="text-green-600 hover:text-green-700 transition-colors"
                >
                  Send Policy
                </button>
                <span class="text-slate-300">•</span>
                <button
                  v-cursor
                  @click="handleAction('flag_driver')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  Flag Applicant
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions for Applicant -->
        <div class="flex gap-3">
          <BaseButton
            :icon="Check"
            :label="'Move to Pending'"
            :variant="'success'"
            v-cursor
            v-if="applicant.status === 'New'"
            @click="handleMoveToPending"
            class="px-4 py-2 font-medium"
          />
          <BaseButton
            :icon="X"
            :label="'Reject'"
            :variant="'danger'"
            v-cursor
            v-if="['New', 'Pending'].includes(applicant.status)"
            @click="updateStatus('Rejected')"
            class="px-4 py-2 font-medium"
          />
          <div class="h-8 w-px bg-slate-200 mx-2"></div>

          <BaseButton
            v-if="applicant"
            @click="generateApplicationReport(applicant)"
            label="Export PDF"
            :icon="FileText"
          />
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-cursor
            @click="activeTab = 'overview'"
            :class="[
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            ]"
          >
            Overview
          </button>
          <button
            v-cursor
            @click="activeTab = 'review'"
            :class="[
              activeTab === 'review'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            ]"
          >
            Full Application Review
          </button>
          <button
            v-cursor
            @click="activeTab = 'documents'"
            :class="[
              activeTab === 'documents'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            ]"
          >
            Documents
          </button>
        </nav>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Identity & Contact Card -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 h-fit">
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <User class="w-5 h-5 text-slate-400" /> Applicant Details
          </h2>
          <!-- Personal information -->
          <div class="space-y-3 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Full Name</span>
              <span class="font-medium text-slate-900"
                >{{ capitalizeName(applicant.personalInfo.firstName) }}
                {{ capitalizeName(applicant.personalInfo.lastName) }}</span
              >
            </div>
            <!-- Contact -->
            <div class="flex flex-col gap-1">
              <span class="text-slate-500">Contact</span>
              <div class="flex items-center gap-2 text-slate-900">
                <Phone class="w-3 h-3 text-slate-400" /> {{ applicant.personalInfo.phone }}
              </div>
              <div class="flex items-center gap-2 text-slate-900">
                <Mail class="w-3 h-3 text-slate-400" /> {{ applicant.personalInfo.email }}
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
              <span class="text-slate-500">license Number</span>
              <span class="font-medium text-slate-900 font-mono">{{
                applicant.licenses[0]?.number || 'Not Provided'
              }}</span>
            </div>

            <div class="flex flex-col gap-1 pt-2 border-t border-slate-100">
              <span class="text-slate-500">Notes / Cover Letter</span>
              <p class="text-slate-700 italic">{{ applicant.notes || 'No notes provided.' }}</p>
            </div>
          </div>
        </div>

        <!-- Checklist for Pending Elements -->
        <div
          class="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6"
        >
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck class="w-6 h-6 text-indigo-600" /> Application Checklist
            </h2>
            <div class="flex flex-col items-end gap-1">
              <span class="text-sm font-semibold" :class="progressColor">
                {{ completedCount }} of {{ complianceItems.length }} Requirements Met
              </span>
              <div class="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-500"
                  :class="progressBarColor"
                  :style="{ width: `${(completedCount / complianceItems.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(group, category) in groupedItems" :key="category" class="space-y-3">
              <h3
                class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"
              >
                <component :is="getCategoryIcon(category)" class="w-3.5 h-3.5" />
                {{ category }}
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="item in group"
                  :key="item.label"
                  class="flex items-start gap-3 p-2 rounded-lg transition-colors border"
                  :class="
                    item.isCompleted
                      ? 'bg-green-50/50 border-green-100'
                      : 'bg-orange-50/50 border-orange-100'
                  "
                >
                  <div class="mt-0.5">
                    <CheckCircle2 v-if="item.isCompleted" class="w-4 h-4 text-green-600" />
                    <XCircle v-else class="w-4 h-4 text-orange-400" />
                  </div>
                  <div class="flex flex-col">
                    <span
                      class="text-sm font-medium"
                      :class="item.isCompleted ? 'text-green-800' : 'text-orange-800'"
                    >
                      {{ item.label }}
                    </span>
                    <span
                      v-if="!item.isCompleted"
                      class="text-[10px] text-orange-600/70 font-medium"
                      >Pending Requirement</span
                    >
                    <span v-else class="text-[10px] text-green-600/70 font-medium">Verified</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="completedCount < complianceItems.length"
            class="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3"
          >
            <AlertCircle class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div class="text-sm text-amber-800">
              <p class="font-bold">Pending Approval Warning</p>
              <p class="opacity-80">
                This application has missing requirements. Review all documents before approving.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Application Review Tab -->
      <div v-else-if="activeTab === 'review'">
        <ApplicantReviewData :applicant="applicant" />
      </div>

      <!-- Documents Tab -->
      <div v-else-if="activeTab === 'documents'">
        <ComplianceDocuments
          title="All Applicant Related Files"
          v-if="applicant && applicantAsDriver"
          :driver="applicantAsDriver"
          :logs="documents"
          @view="handleViewDocument"
          @upload="openUploadModal"
          @view-log="handleViewLog"
          @view-application="() => generateApplicationReport(applicant!)"
          @view-signature="handleViewSignature"
        />
      </div>

      <!-- Action Modal -->
      <DriverActionModal
        v-if="actionModal.isOpen"
        :isOpen="actionModal.isOpen"
        :mode="actionModal.mode"
        :driver="applicantAsDriver"
        @close="actionModal.isOpen = false"
        @success="handleActionSuccess"
      />

      <!-- Pdf Viewer & Upload -->
      <DocumentUploadModal
        v-if="isUploadModalOpen"
        :isOpen="isUploadModalOpen"
        :driverId="applicant.id"
        :driverName="fullName"
        :documentType="selectedDocType"
        :isApplicant="true"
        @close="isUploadModalOpen = false"
        @success="fetchApplicantData"
      />

      <PdfViewerModal
        v-if="isPdfModalOpen"
        :isOpen="isPdfModalOpen"
        :pdfUrl="viewingPdfUrl"
        :title="viewingPdfTitle"
        @close="isPdfModalOpen = false"
      />

      <SignatureProofModal
        v-if="signatureProof.isOpen"
        :isOpen="signatureProof.isOpen"
        :doc="signatureProof.doc"
        @close="signatureProof.isOpen = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dataService } from '@/services/dataService'
import type {
  Applications,
  DriverApplicationForm,
  Driver,
  DocumentLog,
  SignatureDoc,
} from '@/types'
import { capitalizeName, formatDate } from '@/utils/utils'
import { useApplicationReport } from '@/Composables/useApplicationReport'
import DriverActionModal from '@/Components/templates/forms/DriverActionModal.vue'
import dayjs from 'dayjs'

const { generateApplicationReport } = useApplicationReport()
import {
  User,
  Phone,
  Mail,
  Calendar,
  Check,
  X,
  Briefcase,
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  FileSignature,
  Image as ImageIcon,
  MapPin,
} from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import ApplicantReviewData from '@/Components/templates/ApplicantReviewData.vue'
import ComplianceDocuments from '@/Components/templates/ComplianceDocuments.vue'
import DocumentUploadModal from '@/Components/templates/forms/DocumentUploadModal.vue'
import PdfViewerModal from '@/Components/ui/PdfViewerModal.vue'
import SignatureProofModal from '@/Components/ui/SignatureProofModal.vue'
import { useDocumentsStore } from '@/stores/documentsStore'

const activeTab = ref<'overview' | 'review' | 'documents'>('overview')
const documents = ref<DocumentLog[]>([])
const isUploadModalOpen = ref(false)
const selectedDocType = ref('')
const isPdfModalOpen = ref(false)
const viewingPdfUrl = ref('')
const viewingPdfTitle = ref('')

const signatureProof = ref({
  isOpen: false,
  doc: null as SignatureDoc | null,
})

const route = useRoute()
const applicationId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

// Combine types to ensure we have both table metadata and full form data
type ApplicantData = Applications & DriverApplicationForm

const applicant = ref<ApplicantData | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
// Action Modal State
const actionModal = ref({
  isOpen: false,
  mode: '',
})

const documentStore = useDocumentsStore()

const complianceItems = computed(() => {
  if (!applicant.value) return []
  const a = applicant.value

  return [
    // Identity
    { label: 'SSN Number', isCompleted: !!a.personalInfo?.ssnNumber, category: 'Identity' },
    { label: 'DOB Provided', isCompleted: !!a.personalInfo?.dob, category: 'Identity' },

    // History
    { label: 'Address History', isCompleted: (a.addresses?.length ?? 0) > 0, category: 'History' },
    { label: 'Licenses List', isCompleted: (a.licenses?.length ?? 0) > 0, category: 'History' },
    {
      label: 'Employment History',
      isCompleted: (a.employmentHistory?.length ?? 0) > 0,
      category: 'History',
    },

    // Documents
    { label: 'License Front', isCompleted: !!a.licenseFront, category: 'Documents' },
    { label: 'License Back', isCompleted: !!a.licenseBack, category: 'Documents' },
    { label: 'Medical Card', isCompleted: !!a.medicalCard, category: 'Documents' },
    {
      label: 'MVR Report',
      isCompleted: !!(a as Record<string, unknown>).mvr,
      category: 'Documents',
    },
    {
      label: 'Drug & Alcohol',
      isCompleted: !!(a as Record<string, unknown>).drugAlcohol,
      category: 'Documents',
    },
    {
      label: 'Road Test',
      isCompleted: !!(a as Record<string, unknown>).roadTest,
      category: 'Documents',
    },

    // Signatures
    { label: 'Drug Test Consent', isCompleted: !!a.drugTestSignature, category: 'Signatures' },
    { label: 'PSP Disclosure', isCompleted: !!a.pspDisclosureSignature, category: 'Signatures' },
    { label: 'FMCSA Consent', isCompleted: !!a.fmcsaConsentSignature, category: 'Signatures' },
    { label: 'Auth & Release', isCompleted: !!a.authReleaseSignature, category: 'Signatures' },
    { label: 'Work Policies', isCompleted: !!a.generalWorkPolicySignature, category: 'Signatures' },
  ]
})

const groupedItems = computed(() => {
  const groups: Record<string, typeof complianceItems.value> = {}
  complianceItems.value.forEach((item) => {
    const cat = item.category
    if (!groups[cat]) {
      groups[cat] = []
    }
    const targetGroup = groups[cat]
    if (targetGroup) {
      targetGroup.push(item)
    }
  })
  return groups
})

const completedCount = computed(() => complianceItems.value.filter((i) => i.isCompleted).length)

const progressColor = computed(() => {
  const ratio =
    complianceItems.value.length > 0 ? completedCount.value / complianceItems.value.length : 0
  if (ratio === 1) return 'text-green-600'
  if (ratio > 0.5) return 'text-indigo-600'
  return 'text-orange-600'
})

const progressBarColor = computed(() => {
  const ratio =
    complianceItems.value.length > 0 ? completedCount.value / complianceItems.value.length : 0
  if (ratio === 1) return 'bg-green-500'
  if (ratio > 0.5) return 'bg-indigo-500'
  return 'bg-orange-500'
})

// Map Applicant to Driver structure for compatibility with DriverActionModal
const applicantAsDriver = computed<Driver | null>(() => {
  if (!applicant.value) return null
  return {
    ...applicant.value,
    id: applicant.value.id,
    firstName: applicant.value.personalInfo.firstName,
    lastName: applicant.value.personalInfo.lastName,
    email: applicant.value.personalInfo.email,
    phone: applicant.value.personalInfo.phone,
    ssnNumber: applicant.value.personalInfo.ssnNumber || '',
    w9Signed: false,
    // Provide remaining required Driver fields with fallbacks
    middleName: applicant.value.personalInfo.middleName || '',
    dob: applicant.value.personalInfo.dob || '',
    hireDate: dayjs().toISOString(),
    hireStatus: 'Pending',
    address: applicant.value.addresses?.[0]?.street || '',
    city: applicant.value.addresses?.[0]?.city || '',
    state: applicant.value.addresses?.[0]?.state || '',
    zip: applicant.value.addresses?.[0]?.zip || '',
    license: {
      documentNumber: applicant.value.licenses?.[0]?.number || '',
      expiryDate: applicant.value.licenses?.[0]?.expirationDate,
      state: applicant.value.licenses?.[0]?.state || '',
    },
    medical: {
      documentNumber: '',
      expiryDate: applicant.value.medicalCard ? dayjs().toISOString() : undefined,
    },
    mvr: { documentNumber: '' },
    drugAlcohol: { documentNumber: '' },
    roadTest: { documentNumber: '', examiner: '' },
    emergencyContact: { name: '', phone: '', relationship: '' },
  } as unknown as Driver
})

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Identity':
      return User
    case 'History':
      return MapPin
    case 'Documents':
      return ImageIcon
    case 'Signatures':
      return FileSignature
    default:
      return FileText
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hired':
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
      // Cast to intersection type
      applicant.value = data as unknown as ApplicantData

      // Fetch documents
      const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
      documents.value = await dataService.getDocumentLogsByEntity(fullName)
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

const updateStatus = async (status: 'Pending' | 'Rejected' | 'Hired') => {
  if (!applicant.value) return
  try {
    await dataService.updateApplicationStatus(applicant.value.id, status)
    applicant.value.status = status
  } catch (err) {
    console.error('Error updating status:', err)
    alert('Failed to update status')
  }
}

const handleMoveToPending = async () => {
  if (!applicant.value) return
  if (!confirm('This will create a Pending Driver record from this application. Continue?')) return

  try {
    isLoading.value = true
    await dataService.migrateApplicantToDriver(applicant.value.id)
    applicant.value.status = 'Pending'
    alert('Application moved to Pending and Driver record created successfully.')
  } catch (err: unknown) {
    console.error('Error migrating to driver:', err)
    alert(err instanceof Error ? err.message : 'Failed to migrate application')
  } finally {
    isLoading.value = false
  }
}

function handleAction(mode: string) {
  actionModal.value.mode = mode
  actionModal.value.isOpen = true
}

async function handleActionSuccess({
  mode,
  data,
}: {
  mode: string
  data: Record<string, unknown>
}) {
  if (!applicant.value?.id) return

  if (mode === 'flag_driver') {
    try {
      const updatedApplicant = {
        ...applicant.value,
        isFlagged: true,
        flagReason: data.reason as string,
        flagDate: dayjs().toISOString(),
      }
      // Update local state immediately
      applicant.value = updatedApplicant

      // Persist using generic update
      await dataService.updateApplication(updatedApplicant as unknown as Applications)
    } catch (err) {
      console.error('Failed to flag applicant:', err)
      alert('Failed to flag applicant')
    }
  } else {
    // Show success for other informational actions
    alert(`Action "${mode}" simulated for ${applicant.value.personalInfo.firstName}`)
  }
}

async function clearFlag() {
  if (!applicant.value?.id) return
  if (!confirm('Are you sure you want to CLEAR this flag?')) return

  try {
    const updatedApplicant = {
      ...applicant.value,
      isFlagged: false,
      flagReason: '',
      flagDate: '',
    }
    applicant.value = updatedApplicant
    await dataService.updateApplication(updatedApplicant as unknown as Applications)
  } catch (err) {
    console.error('Failed to clear flag:', err)
  }
}

const fullName = computed(() => {
  if (!applicant.value) return ''
  const { firstName, middleName, lastName } = applicant.value.personalInfo
  return `${capitalizeName(firstName)} ${middleName ? capitalizeName(middleName) + ' ' : ''}${capitalizeName(lastName)}`
})

function openUploadModal(docType: string) {
  selectedDocType.value = docType
  isUploadModalOpen.value = true
}

function handleViewDocument(doc: { file?: string; label?: string }) {
  if (doc.file) {
    viewingPdfUrl.value = doc.file
    viewingPdfTitle.value = doc.label || 'Document'
    isPdfModalOpen.value = true
  }
}

function handleViewLog(log: DocumentLog) {
  if (log.fileUrl) {
    viewingPdfUrl.value = log.fileUrl
    viewingPdfTitle.value = log.type
    isPdfModalOpen.value = true
  }
}

function handleViewSignature(doc: SignatureDoc) {
  signatureProof.value.doc = doc
  signatureProof.value.isOpen = true
}

onMounted(() => {
  fetchApplicantData()
})

watch(applicationId, () => {
  fetchApplicantData()
})

// React to store updates
watch(
  () => (applicationId.value ? documentStore.lastUpdate[applicationId.value] : undefined),
  (newVal) => {
    if (newVal) {
      console.log('Detected update from store, refreshing applicant data...')
      fetchApplicantData()
    }
  },
)
</script>
