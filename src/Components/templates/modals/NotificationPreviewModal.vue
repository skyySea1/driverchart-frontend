<template>
  <BaseModal :title="'Send Notifications'" :isOpen="isOpen" @close="emit('close')" size="max-w-2xl">
    <div class="space-y-6">
      <!-- Header Info -->
      <div class="space-y-1">
        <BaseAlert
          v-if="alertState"
          :type="alertState.type"
          :message="alertState.message"
          class="mb-4"
          @close="alertState = null"
        />
        <p class="text-sm text-slate-500">
          Select which notifications you want to send. Showing documents expiring within 30 days or
          already expired.
        </p>
      </div>

      <!-- Selection Header -->
      <div class="flex items-center justify-between py-2 border-b border-slate-100">
        <label class="flex items-center gap-3 cursor-pointer group" @click="toggleSelectAll">
          <div
            class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :class="[
              isAllSelected
                ? 'bg-slate-900 border-slate-900'
                : 'border-slate-300 group-hover:border-slate-400',
            ]"
          >
            <Check v-if="isAllSelected" class="w-3.5 h-3.5 text-white" />
          </div>
          <span class="text-sm font-bold text-slate-700"
            >Select All ({{ notifications.length }})</span
          >
        </label>
        <div class="flex items-center gap-2">
          <button
            @click="showPreview = !showPreview"
            class="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1"
          >
            {{ showPreview ? 'Hide Email Preview' : 'Show Email Preview' }}
          </button>
          <BaseBadge variant="secondary" class="bg-slate-100 text-slate-700 px-3 py-1 border-0">
            {{ selectedIds.length }} selected
          </BaseBadge>
        </div>
      </div>

      <!-- Email Template Preview -->
      <div
        v-if="showPreview"
        class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 space-y-2 mb-4"
      >
        <h4 class="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">
          Email Template Preview
        </h4>
        <div class="font-mono text-xs bg-white p-3 rounded border border-slate-100">
          <p class="mb-2">
            <strong>Subject:</strong> Attention: Your [Document Type] is expiring soon / expired
          </p>
          <hr class="border-slate-100 my-2" />
          <p>Hello <strong>[Driver Name]</strong>,</p>
          <p>This is an automated notification regarding your <strong>[Document Type]</strong>.</p>
          <p>
            Status:
            <span class="font-bold text-amber-600"
              >Expiring in [X] days / Expired [X] days ago</span
            >
          </p>
          <p>Expiration Date: <strong>[Date]</strong></p>
          <p>Please update your document as soon as possible to maintain compliance.</p>
          <p class="text-xs text-slate-400 mt-2">
            This is an automated message from CharterSafe Compliance System.
          </p>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        <div
          v-if="loadingData"
          class="py-12 text-center text-slate-500 flex flex-col items-center gap-2"
        >
          <div
            class="w-6 h-6 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"
          ></div>
          <span class="text-xs">Loading notifications...</span>
        </div>

        <div
          v-else-if="notifications.length === 0"
          class="py-12 text-center text-slate-400 flex flex-col items-center gap-2"
        >
          <CheckCircle2 class="w-8 h-8 text-slate-300" />
          <span class="text-sm font-bold">All Good!</span>
          <span class="text-xs">No documents are expiring within the next 30 days.</span>
        </div>

        <div
          v-else
          v-for="notification in notifications"
          :key="`${notification.driverId}-${notification.documentType}`"
          class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-4 items-start hover:border-slate-300 transition-colors"
        >
          <div
            class="w-5 h-5 mt-1 rounded border flex items-center justify-center cursor-pointer transition-colors"
            :class="[
              isSelected(notification)
                ? 'bg-slate-900 border-slate-900'
                : 'bg-white border-slate-300 hover:border-slate-400',
            ]"
            @click="toggleSelect(notification)"
          >
            <Check v-if="isSelected(notification)" class="w-3.5 h-3.5 text-white" />
          </div>

          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User class="w-4 h-4 text-slate-500" />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-bold text-slate-800">{{ notification.driverName }}</span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="getDocumentBadgeClass(notification.documentType)"
                >
                  {{ notification.documentType }}
                </span>
              </div>
            </div>

            <div class="pl-10 space-y-1">
              <div class="text-sm text-slate-500">{{ notification.email }}</div>
              <div
                class="flex items-center gap-1.5 text-xs font-semibold"
                :class="getStatusColor(notification.daysLeft)"
              >
                <AlertCircle class="w-3.5 h-3.5" />
                {{ getStatusText(notification) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="pt-4 flex justify-end">
        <BaseButton
          label="Send Notifications"
          :icon="Send"
          :loading="loading"
          :disabled="selectedIds.length === 0"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8"
          @click="handleSend"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/Components/ui/modal/BaseModal.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseBadge from '@/Components/ui/badges/BaseBadge.vue'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import { Check, User, AlertCircle, Send, CheckCircle2 } from 'lucide-vue-next'
import { dataService } from '@/services/dataService'
import type { AlertType } from '@/types'

interface NotificationItem {
  driverId: string
  driverName: string
  email: string
  documentType: string
  dueDate: string
  daysLeft: number
}

const props = defineProps<{
  isOpen: boolean
  notifications: NotificationItem[]
  loadingData?: boolean
}>()

const emit = defineEmits(['close', 'sent'])

const loading = ref(false)
const showPreview = ref(false)
const selectedKeys = ref<Set<string>>(new Set())
const alertState = ref<{ type: AlertType; message: string } | null>(null)

// Support Select All
const selectedIds = computed(() => Array.from(selectedKeys.value))
const isAllSelected = computed(() => {
  return props.notifications.length > 0 && selectedKeys.value.size === props.notifications.length
})

function getNotificationKey(n: NotificationItem) {
  return `${n.driverId}-${n.documentType}`
}

function isSelected(n: NotificationItem) {
  return selectedKeys.value.has(getNotificationKey(n))
}

function toggleSelect(n: NotificationItem) {
  const key = getNotificationKey(n)
  if (selectedKeys.value.has(key)) {
    selectedKeys.value.delete(key)
  } else {
    selectedKeys.value.add(key)
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedKeys.value.clear()
  } else {
    props.notifications.forEach((n) => selectedKeys.value.add(getNotificationKey(n)))
  }
}

function getDocumentBadgeClass(type: string) {
  if (type === 'Driver License') return 'bg-red-500 text-white'
  if (type === 'Medical Card' || type === 'Medical') return 'bg-red-500 text-white'
  return 'bg-slate-200 text-slate-700'
}

function getStatusColor(daysLeft: number) {
  return daysLeft < 0 ? 'text-red-500' : 'text-amber-600'
}

function getStatusText(n: NotificationItem) {
  if (n.daysLeft < 0) return `Expired ${Math.abs(n.daysLeft)} days ago`
  if (n.daysLeft === 0) return 'Expires today'
  return `Expiring in ${n.daysLeft} days`
}

async function handleSend() {
  loading.value = true
  try {
    alertState.value = null
    const toSend = props.notifications.filter((n) => selectedKeys.value.has(getNotificationKey(n)))
    const result = await dataService.sendNotifications(toSend)

    if (result.success && result.sentCount > 0) {
      alertState.value = {
        type: 'success',
        message: `Successfully sent ${result.sentCount} notifications.`,
      }
      setTimeout(() => {
        emit('sent')
        emit('close')
      }, 2000)
    } else {
      alertState.value = {
        type: 'error',
        message:
          'No notifications were sent. Please check if the drivers have valid email addresses and the Resend API key is configured.',
      }
    }
  } catch (error) {
    console.error('Failed to send notifications:', error)
    alertState.value = {
      type: 'error',
      message: 'Failed to connect to the notification service. Please try again later.',
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (!open) {
      selectedKeys.value.clear()
      showPreview.value = false
      alertState.value = null
    }
  },
)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
