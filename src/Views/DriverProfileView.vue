<template>
  <div class="space-y-6">
    <!-- Loading & Error States -->
    <BaseLoading v-if="isLoading" />
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
      {{ error }}
    </div>

    <div v-else-if="driver" class="space-y-6">
      <!-- Back Button -->
      <BaseButton
        label="Back to Drivers"
        :icon="ArrowLeft"
        :variant="'blue'"
        @click="router.back()"
        class="text-sm font-medium shadow-sm"
      />

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
      >
        <div class="flex-1 w-full">
          <!-- Flag Alert Banner -->
          <div v-if="driver.isFlagged" class="mb-4 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm border-l-4 border-l-red-600">
            <div class="flex items-center gap-2 text-slate-800 text-sm">
              <div class="bg-red-600 rounded-full p-1.5 shadow-sm">
                <Flag class="w-3.5 h-3.5 text-white" fill="currentColor" />
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-black text-slate-900 border-r border-slate-200 pr-1.5 mr-0.5">{{ dayjs(driver.flagDate).format('MM/DD/YYYY') }}:</span>
                <span class="text-slate-600 font-medium">{{ driver.flagReason }}</span>
              </div>
            </div>
            <button @click="clearFlag" class="text-[11px] font-black text-slate-800 hover:text-red-700 underline underline-offset-2 transition-all cursor-pointer mr-2">
              CLEAR FLAG
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200 uppercase"
            >
              {{ driver.firstName?.[0] }}{{ driver.lastName?.[0] }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                {{ capitalizeName(driver.firstName) }} {{ capitalizeName(driver.lastName) }}
              </h1>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="
                    driver.hireStatus === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  "
                >
                  {{ driver.hireStatus }}
                </span>
                <span class="text-sm text-slate-500 flex items-center gap-1">
                  <Calendar class="w-3 h-3" /> Hired: {{ formatDate(driver.hireDate) }}
                </span>
              </div>

              <!-- Quick Actions Row -->
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-slate-100 text-[13px] font-semibold">
                <button v-cursor @click="handleAction('send_policy')" class="text-green-600 hover:text-green-700 transition-colors">Send Policy</button>
                <span class="text-slate-300">•</span>
                <button v-cursor @click="handleAction('send_memo')" class="text-green-600 hover:text-green-700 transition-colors">Send Memo</button>
                <span class="text-slate-300">•</span>
                <button v-cursor @click="handleAction('request_license')" class="text-green-600 hover:text-green-700 transition-colors">Request License Upload</button>
                <span class="text-slate-300">•</span>
                <button v-cursor @click="handleAction('request_medical')" class="text-green-600 hover:text-green-700 transition-colors">Request Med Card Upload</button>
                <span class="text-slate-300">•</span>
                <button v-cursor @click="handleAction('request_fcra')" class="text-green-600 hover:text-green-700 transition-colors">Request FCRA Signature</button>
                <span class="text-slate-300">•</span>
                <button v-cursor @click="handleAction('flag_driver')" class="text-red-600 hover:text-red-700 transition-colors">Flag Driver</button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="generateComplianceReport"
            class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
          >
            <Download class="w-4 h-4" />
            Compliance Report
          </button>
          <BaseButton
            label="Edit Driver"
            @click="editProfile(driver)"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
          >
            Edit Profile
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Identity & Contact Card -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 h-fit">
            <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <User class="w-5 h-5 text-slate-400" /> Driver Information
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex flex-col gap-1">
                <span class="text-slate-500">Full Name</span>
                <span class="font-medium text-slate-900">{{ driverName }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-slate-500">Contact</span>
                <div class="flex items-center gap-2 text-slate-900">
                  <Phone class="w-3 h-3 text-slate-400" /> {{ driver.phone }}
                </div>
                <div class="flex items-center gap-2 text-slate-900">
                  <Mail class="w-3 h-3 text-slate-400" /> {{ driver.email }}
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-slate-500">Address</span>
                <div class="flex items-start gap-2 text-slate-900">
                  <MapPin class="w-3 h-3 text-slate-400 mt-1" />
                  <span>{{ formattedAddress }}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-slate-500">Emergency Contact</span>
                <span class="font-medium text-slate-900">{{
                  capitalizeName(driver.emergencyContact?.name || 'N/A')
                }}</span>
                <span class="flex items-center gap-2 text-slate-600">
                  <Phone class="w-3 h-3 text-slate-400" />{{ driver.emergencyContact?.phone }} ({{
                    capitalizeName(driver.emergencyContact?.relationship || 'N/A')
                  }})
                </span>
              </div>
            </div>
          </div>

          <!-- Activity Timeline -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <History class="w-5 h-5 text-slate-400" /> Activity Timeline
            </h2>
            <div
              class="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.75 before:w-0.5 before:bg-slate-100 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div v-for="(event, idx) in timelineEvents" :key="idx" class="relative">
                <div
                  class="absolute -left-5.75 mt-1 h-3 w-3 rounded-full border-2 border-white bg-primary-500"
                ></div>
                <div>
                  <div class="text-xs text-slate-400 font-medium">{{ formatDate(event.date) }}</div>
                  <div class="text-sm font-medium text-slate-800">{{ event.title }}</div>
                  <div v-if="event.description" class="text-xs text-slate-500 mt-0.5">
                    {{ event.description }}
                  </div>
                  <div class="text-[12px] text-slate-400 font-bold mt-1 italic">by {{ event.user || 'Unknown' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance Health Check & Documents -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Compliance Health Check -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-slate-400" /> Compliance Health Check
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(item, idx) in complianceItems"
                :key="idx"
                class="p-4 rounded-lg border flex items-start justify-between transition-all hover:shadow-md"
                :class="getStatusColor(getStatus(item.date))"
              >
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wider opacity-75">{{
                    item.label
                  }}</span>
                  <div class="font-bold text-lg mt-1">
                    {{ getStatus(item.date) === 'missing' ? 'Missing' : formatDate(item.date) }}
                  </div>
                  <div class="text-xs opacity-80 mt-1">{{ item.doc || 'No Ref #' }}</div>
                </div>
                <component :is="getStatusIcon(getStatus(item.date))" class="w-6 h-6 opacity-80" />
              </div>
            </div>
          </div>

          <!-- Document Wallet (New Implementation) -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText class="w-5 h-5 text-slate-400" /> Document Wallet
              </h2>
              <div class="text-xs text-slate-400">Manage active documents</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="docType in ['license', 'medical', 'mvr', 'drugAlcohol', 'roadTest']"
                :key="docType"
                class="p-4 rounded-xl bg-slate-100 flex flex-col justify-between h-full"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      {{ getDocLabel(docType) }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">
                      Expires:
                      <span :class="getStatusTextColor(getDriverDocument(docType).expiryDate)">
                        {{ formatDate(getDriverDocument(docType).expiryDate) }}
                      </span>
                    </p>
                  </div>
                  <div
                    v-if="getDriverDocument(docType).file"
                    class="bg-green-100 text-green-700 p-1.5 rounded-full"
                  >
                    <CheckCircle class="w-4 h-4" />
                  </div>
                  <div v-else class="bg-slate-200 text-slate-400 p-1.5 rounded-full">
                    <AlertTriangle class="w-4 h-4" />
                  </div>
                </div>

                <div class="flex gap-2 mt-auto">
                  <button
                    v-if="getDriverDocument(docType).file"
                    @click="openPdfViewer(docType)"
                    class="flex-1 text-center py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText class="w-3 h-3" /> View
                  </button>

                  <button
                    v-if="can(PERMISSIONS.DRIVERS_EDIT)"
                    @click="editProfile(driver)"
                    class="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
                    title="Edit Details"
                  >
                    <Edit class="w-3 h-3" />
                  </button>

                  <button
                    v-if="can(PERMISSIONS.DOCUMENTS_UPLOAD)"
                    v-cursor
                    @click="openUploadModal(docType)"
                    class="flex-1 text-center py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Upload class="w-3 h-3" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Document History (Logs) -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <History class="w-5 h-5 text-slate-400" /> Document History
            </h2>
            <div v-if="documents.length === 0" class="text-center py-8 text-slate-500 text-sm">
              No audit logs found.
            </div>
            <div v-else class="overflow-x-auto overflow-y-auto max-h-[350px] rounded-lg border border-slate-200 custom-scrollbar">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Date
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Action
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  <tr v-for="doc in documents" :key="doc.id" class="hover:bg-slate-50">
                    <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(doc.date) }}</td>
                    <td class="px-4 py-3 text-sm font-medium text-slate-900">
                      Uploaded {{ doc.type }} ({{
                        doc.fileName ? cleanFileName(doc.fileName) : 'Unknown File'
                      }})
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-500">{{ doc.user }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="driver">
      <DriverFormModal
        v-if="modalStore.activeModal === 'driver'"
        :driver="modalStore.data as Driver"
        @close="closeModal"
        @saved="onDriverUpdated"
      />

      <DocumentUploadModal
        v-if="isUploadModalOpen"
        :isOpen="isUploadModalOpen"
        :driverId="driver.id"
        :driverName="driverName"
        :documentType="selectedDocType"
        :currentExpiry="currentDocExpiry"
        @close="isUploadModalOpen = false"
        @success="onDriverUpdated"
      />

      <PdfViewerModal
        v-if="isPdfModalOpen"
        :isOpen="isPdfModalOpen"
        :pdfUrl="viewingPdfUrl"
        :title="viewingPdfTitle"
        @close="isPdfModalOpen = false"
      />

      <DriverActionModal
        v-if="actionModal.isOpen"
        :isOpen="actionModal.isOpen"
        :mode="actionModal.mode"
        :driver="driver"
        @close="actionModal.isOpen = false"
        @success="handleActionSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dataService } from '@/services/dataService'
import { useModalStore } from '@/stores/ModalStore'
import { usePermissions } from '@/Composables/usePermissions'
import { PERMISSIONS } from '@/utils/permissions'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import DocumentUploadModal from '@/Components/templates/forms/DocumentUploadModal.vue'
import PdfViewerModal from '@/Components/ui/PdfViewerModal.vue'
import DriverActionModal from '@/Components/templates/forms/DriverActionModal.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseLoading from '@/Components/ui/BaseLoading.vue'
import type { Driver, DocumentLog, AuditLog } from '@/types'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  History,
  ArrowLeft,
  Mail,
  Upload,
  Edit,
  Flag,
} from 'lucide-vue-next'
import dayjs from 'dayjs'
import { capitalizeName } from '@/utils/utils'
import { useComplianceReport } from '@/Composables/useComplianceReport'
const router = useRouter()
const route = useRoute()
const modalStore = useModalStore()
const { can } = usePermissions()

const { generateComplianceReport: generatePDFReport } = useComplianceReport()

const driver = ref<Driver | null>(null)
const documents = ref<DocumentLog[]>([])
const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Upload Modal State
const isUploadModalOpen = ref(false)
const selectedDocType = ref('')
const currentDocExpiry = ref('')

// PDF Viewer State
const isPdfModalOpen = ref(false)
const viewingPdfUrl = ref('')
const viewingPdfTitle = ref('')

// Action Modal State
const actionModal = ref({
  isOpen: false,
  mode: ''
})

const driverId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const driverName = computed(() => {
  if (!driver.value) return ''
  return `${capitalizeName(driver.value.firstName)} ${capitalizeName(driver.value.middleName)} ${capitalizeName(driver.value.lastName)}`
})

const formattedAddress = computed(() => {
  if (!driver.value) return 'N/A'
  const parts = [
    driver.value.address ? capitalizeName(driver.value.address) : '',
    driver.value.city ? capitalizeName(driver.value.city) : '',
    driver.value.state || '',
    driver.value.zip || '',
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'N/A'
})

// Compliance Status Helper
const getStatus = (expiryDate?: string) => {
  if (!expiryDate) return 'missing'
  const today = dayjs()
  const exp = dayjs(expiryDate)
  const diff = exp.diff(today, 'day')

  if (diff < 0) return 'expired'
  if (diff <= 30) return 'warning'
  return 'valid'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'valid':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusTextColor = (date?: string) => {
  const s = getStatus(date)
  if (s === 'expired') return 'text-red-600 font-bold'
  if (s === 'warning') return 'text-yellow-600 font-bold'
  return 'text-slate-700'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'valid':
      return CheckCircle
    case 'warning':
      return AlertTriangle
    case 'expired':
      return XCircle
    default:
      return User
  }
}

const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  return dayjs(date).format('MM/DD/YYYY')
}

const fetchDriverData = async () => {
  if (!driverId.value) return

  isLoading.value = true
  error.value = null
  try {
    const data = await dataService.getDriverById(driverId.value)
    if (data) {
      driver.value = data
      // Fetch documents based on driver name
      const driverFullName = `${data.firstName} ${data.lastName}`
      const [docs, audits] = await Promise.all([
        dataService.getDocumentLogsByEntity(driverFullName),
        dataService.getAuditLogsByEntity(driverId.value),
      ])
      documents.value = docs
      auditLogs.value = audits
    } else {
      error.value = 'Driver not found'
    }
  } catch (err) {
    error.value = 'Failed to load driver data'
    console.error('Error fetching driver:', err)
  } finally {
    isLoading.value = false
  }
}

const complianceItems = computed(() => {
  if (!driver.value) return []
  return [
    {
      label: 'License',
      date: driver.value.license?.expiryDate,
      doc: driver.value.license?.documentNumber,
    },
    {
      label: 'Medical Card',
      date: driver.value.medical?.expiryDate,
      doc: 'Registry: ' + (driver.value.medical?.registry || 'N/A'),
    },
    { label: 'MVR Check', date: driver.value.mvr?.expiryDate, doc: 'Annual Review' },
    { label: 'Drug & Alcohol', date: driver.value.drugAlcohol?.expiryDate, doc: 'Clearinghouse' },
  ]
})

function cleanFileName(name: string) {
  try {
    // Decode URL entities like %2F
    const decoded = decodeURIComponent(name)
    // Take the last part after /
    const parts = decoded.split('/')
    const fileName = parts[parts.length - 1]
    // Remove query params if any
    return fileName ? fileName.split('?')[0] : ''
  } catch {
    return name
  }
}

const timelineEvents = computed(() => {
  const events: { date: string; title: string; description?: string; user?: string }[] = []

  // Add system creation if not in audit logs (fallback for legacy)
  const hasCreation = auditLogs.value.some(l => l.type === 'creation')
  if (!hasCreation && driver.value?.hireDate) {
    events.push({
      date: driver.value.hireDate,
      title: 'Profile Created',
      description: 'System initialization / Migration',
      user: 'System'
    })
  }

  auditLogs.value.forEach((log) => {
    let title = 'Profile Update'
    if (log.type === 'status_change') title = 'Status Changed'
    if (log.type === 'creation') title = 'Profile Created'

    events.push({
      date: log.date,
      title,
      description: log.description,
      user: log.user
    })
  })

  // Sort by date descending
  return events.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
})

const editProfile = (d: Driver) => {
  if (driver.value) {
    modalStore.openModal('driver', d)
  }
}

function closeModal() {
  modalStore.closeModal()
}

async function onDriverUpdated() {
  closeModal()
  await fetchDriverData() // Recarrega os dados atualizados
}

function getDocLabel(type: string) {
  const labels: Record<string, string> = {
    license: 'License',
    medical: 'Medical Certificate',
    mvr: 'MVR Report',
    drugAlcohol: 'Drug & Alcohol',
    roadTest: 'Road Test',
  }
  return labels[type] || type
}

function getDriverDocument(type: string): { file?: string; expiryDate?: string } {
  if (!driver.value) return {}
  const doc = driver.value[type]
  return doc || {}
}

function openUploadModal(type: string) {
  if (!driver.value) return
  selectedDocType.value = type
  currentDocExpiry.value = getDriverDocument(type).expiryDate || ''
  isUploadModalOpen.value = true
}

function openPdfViewer(type: string) {
  const doc = getDriverDocument(type)
  if (doc.file) {
    viewingPdfUrl.value = doc.file
    viewingPdfTitle.value = getDocLabel(type)
    isPdfModalOpen.value = true
  }
}

const generateComplianceReport = () => {
  if (!driver.value) return

  generatePDFReport(driver.value, documents.value)
}

function handleAction(mode: string) {
  actionModal.value.mode = mode
  actionModal.value.isOpen = true
}

async function handleActionSuccess({ mode, data }: { mode: string; data: Record<string, unknown> }) {
  if (!driver.value?.id) return

  if (mode === 'flag_driver') {
    try {
      await dataService.updateDriver({
        ...driver.value,
        id: driver.value.id,
        isFlagged: true,
        flagReason: data.reason as string,
        flagDate: dayjs().toISOString()
      })
      await fetchDriverData()
    } catch (err) {
      console.error('Failed to flag driver:', err)
    }
  } else {
    // Show success for other informational actions
    alert(`Action "${mode}" simulated for ${driver.value.firstName}`)
  }
}

async function clearFlag() {
  if (!driver.value?.id) return
  if (!confirm('Are you sure you want to CLEAR this flag?')) return

  try {
    await dataService.updateDriver({
      ...driver.value,
      id: driver.value.id,
      isFlagged: false,
      flagReason: '',
      flagDate: ''
    })
    await fetchDriverData()
  } catch (err) {
    console.error('Failed to clear flag:', err)
  }
}

onMounted(() => {
  fetchDriverData()
})

watch(driverId, () => {
  fetchDriverData()
})
</script>
