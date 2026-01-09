<template>
  <div class="space-y-6">
    <!-- Loading & Error States -->
    <BaseLoading v-if="isLoading" />
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
      {{ error }}
    </div>

    <div v-else-if="driver" class="space-y-6">
      <!-- Back Button -->
      <BaseButton label="Back to Drivers" :icon="ArrowLeft" :variant="'blue'" @click="$router.back()"
        class=" text-sm font-medium shadow-sm"
          />

      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
      >
        <div>

          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200 uppercase"
            >
              {{ driver.firstName[0] }}{{ driver.lastName[0] }}
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
                 <Mail class="w-3 h-3 text-slate-400" /> {{ driver.email }}</div>
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
                 <Phone class="w-3 h-3 text-slate-400" />{{ driver.emergencyContact?.phone }}
                  ({{ capitalizeName(driver.emergencyContact?.relationship || 'N/A') }})
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
              class="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.75 before:w-0.5 before:bg-slate-100"
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
                class="p-4 rounded-lg border flex items-start justify-between"
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

          <!-- Document Wallet -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText class="w-5 h-5 text-slate-400" /> Document Wallet
              </h2>
              <div class="text-xs text-slate-400">Showing all registered files</div>
            </div>

            <div
              v-if="documents.length === 0"
              class="text-center py-12 text-slate-500 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200"
            >
              <FileText class="w-8 h-8 text-slate-300 mx-auto mb-3" />
              No documents found for this driver.
            </div>

            <div v-else class="overflow-hidden rounded-lg border border-slate-200">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Document Name
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  <tr
                    v-for="doc in documents"
                    :key="doc.id"
                    class="hover:bg-slate-50 transition-colors"
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                      {{ formatDate(doc.date) }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-2"
                    >
                      <FileText class="w-4 h-4 text-slate-400" /> {{ doc.fileName }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                      <span
                        class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600"
                        >{{ doc.type }}</span
                      >
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      {{ doc.user }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Global Driver Modal Integrated with Store -->
            <DriverFormModal
              v-if="modalStore.activeModal === 'driver'"
              :driver="modalStore.data as Driver"
              @close="closeModal"
              @saved="onDriverUpdated"
            />
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
import { useModalStore } from '@/stores/ModalStore'
import DriverFormModal from '@/Components/templates/forms/DriverFormModal.vue'
import type { Driver, DocumentLog } from '@/types'
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
  Mail } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { capitalizeName } from '@/utils/utils'
import BaseButton from '@/Components/ui/BaseButton.vue'
import BaseLoading from '@/Components/ui/BaseLoading.vue'

const route = useRoute()
const modalStore = useModalStore()

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

const driver = ref<Driver | null>(null)
const documents = ref<DocumentLog[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

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
      const driverName = `${data.firstName} ${data.lastName}`
      const docs = await dataService.getDocumentLogsByEntity(driverName)
      documents.value = docs
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
      label: 'Cdl License',
      date: driver.value.cdl?.expiryDate,
      doc: driver.value.cdl?.documentNumber,
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

const timelineEvents = computed(() => {
  const events: { date: string; title: string; description?: string }[] = []

  if (driver.value?.hireDate) {
    events.push({
      date: driver.value.hireDate,
      title: 'Hired / Driver Onboarded',
      description: 'Official start date in the fleet',
    })
  }

  documents.value.forEach((doc) => {
    events.push({
      date: doc.date,
      title: `Document Uploaded: ${doc.type}`,
      description: `${doc.fileName} by ${doc.user}`,
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

const generateComplianceReport = () => {
  if (!driver.value) return

  // Simulated report generation
  const reportContent = `
    COMPLIANCE REPORT: ${driverName.value}
    Date: ${dayjs().format('MM/DD/YYYY HH:mm')}
    --------------------------------------------------
    Cdl Status: ${getStatus(driver.value.cdl?.expiryDate).toUpperCase()} (Exp: ${formatDate(driver.value.cdl?.expiryDate)})
    Medical Status: ${getStatus(driver.value.medical?.expiryDate).toUpperCase()} (Exp: ${formatDate(driver.value.medical?.expiryDate)})
    MVR Status: ${getStatus(driver.value.mvr?.expiryDate).toUpperCase()} (Exp: ${formatDate(driver.value.mvr?.expiryDate)})
    Drug & Alcohol: ${getStatus(driver.value.drugAlcohol?.expiryDate).toUpperCase()} (Exp: ${formatDate(driver.value.drugAlcohol?.expiryDate)})
    --------------------------------------------------
    Audit Rating: 98% Compliance
  `
  // Simple "download" simulation
  const blob = new Blob([reportContent], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = window.document.createElement('a')
  a.href = url
  a.download = `Compliance_Report_${driver.value.lastName}_${dayjs().format('YYYYMMDD')}.txt`
  a.click()
  window.URL.revokeObjectURL(url)

  alert('Compliance report generated and downloaded.')
}

onMounted(() => {
  fetchDriverData()
})

watch(driverId, () => {
  fetchDriverData()
})
</script>
