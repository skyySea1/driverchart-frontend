<template>
  <header class="w-full flex items-center justify-between gap-4 py-4 px-1">
    <!-- Left Section: Mobile Menu & Title/Logo -->
    <div class="flex items-center gap-4">
      <button
        class="md:hidden p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 shadow-sm transition-colors duration-200"
        @click="emit('open-mobile')"
        aria-label="Open Mobile Menu"
        v-cursor
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Logo & Title -->
      <RouterLink to="/" class="flex items-center gap-3 group transition-all" v-cursor>
        <div
          class="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform"
        >
          <Bus class="w-6 h-6 text-white" />
        </div>
        <div class="flex flex-col sm:flex">
          <h1
            class="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors"
          >
            {{ props.title }}
          </h1>
          <p
            v-if="props.subtitle"
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
          >
            {{ props.subtitle }}
          </p>
        </div>
      </RouterLink>
    </div>

    <!-- Right Section: Actions & Profile -->
    <div class="flex items-center gap-3 relative header-menu">
      <!-- Notifications Dropdown -->
      <div class="relative" v-if="props.showNotifications">
        <button
        v-if="false"
          class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105 active:scale-95 duration-200 hover:bg-indigo-50/30 group relative"
          @click="toggleMenu('notifications')"
          aria-label="Notifications"
          v-cursor
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-2.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.6)]"
          ></span>
        </button>

        <div
          v-if="activeDropdown === 'notifications'"
          class="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 p-1.5"
        >
          <div class="px-4 py-3 border-b border-slate-50 flex justify-between items-center mb-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
              >Compliance Notifications</span
            >
            <span
              v-if="unreadCount > 0"
              @click="handleMarkAllRead"
              class="text-[10px] font-bold text-indigo-600 cursor-pointer hover:underline"
              >Mark all read</span
            >
          </div>
          <div class="max-h-80 overflow-y-auto custom-scrollbar">
            <div
              v-for="n in notifications"
              :key="n.id"
              @click="handleNotificationClick(n)"
              class="p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 flex gap-3 group cursor-pointer"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full mt-1.5 shrink-0 transition-all duration-500',
                  n.read ? 'bg-slate-200' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
                ]"
              ></div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm leading-tight group-hover:text-indigo-700 transition-colors',
                    n.read ? 'text-slate-500 font-medium' : 'text-slate-800 font-bold'
                  ]"
                >
                  {{ n.entityName || n.entity || 'System Update' }}
                </p>
                <p class="text-xs text-slate-500 truncate mt-0.5">{{ n.message }}</p>
                <p class="text-[9px] font-black text-slate-400 mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
                  <span class="bg-slate-100 px-1.5 py-0.5 rounded">{{ dayjs(n.dueDate).format('MMM DD') }}</span>
                  <span v-if="!n.read" class="text-indigo-600 flex items-center gap-1">
                    <span class="w-1 h-1 bg-indigo-600 rounded-full animate-pulse"></span>
                    New
                  </span>
                </p>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="notifications.length === 0" class="py-12 px-4 text-center">
              <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 class="w-6 h-6 text-slate-300" />
              </div>
              <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase">All cleared!</p>
              <p class="text-[10px] text-slate-400 mt-1">No compliance alerts at this moment.</p>
            </div>
          </div>

        </div>
      </div>

      <div class="relative" v-if="props.showNotifications">
        <button
          class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105 active:scale-95 duration-200 hover:bg-indigo-50/30 group relative"
          @click="modalStore.openModal('notification')"
          aria-label="Send Notifications"
          v-cursor
        >
          <Send class="w-5 h-5" />
        </button>
      </div>

      <!-- Dropdown -->
      <div class="relative" v-if="props.showMenu">
        <button
          class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105 active:scale-95 duration-200 hover:bg-indigo-50/30 group"
          @click="toggleMenu('add')"
          aria-label="Quick Add"
          v-cursor
        >
          <Plus class="w-5 h-5" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="activeDropdown === 'add'"
          class="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 p-1.5"
        >
          <div class="px-3 py-2 mb-1 border-b border-slate-50">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
              >Create New Record</span
            >
          </div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all"
            @click="handleAddDriver"
            v-cursor
          >
            <div class="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
              <UserPlus class="w-4 h-4" />
            </div>
            New Driver
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
            @click="handleAddVehicle"
            v-cursor
          >
            <div class="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
              <Bus class="w-4 h-4" />
            </div>
            New Vehicle
          </button>
        </div>
      </div>

      <!-- User Profile Dropdown -->
      <div class="relative ml-1">
        <button
          @click="toggleMenu('profile')"
          class="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white transition-all border border-transparent hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 group"
          v-cursor
        >
          <div
            class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform"
          >
            {{ userInitial }}
          </div>
          <span class="text-sm font-bold text-slate-700 hidden sm:inline">{{ userName }}</span>
          <ChevronDown
            class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
          />
        </button>

        <div
          v-if="activeDropdown === 'profile'"
          class="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 p-1.5"
        >
          <div class="px-4 py-3 border-b border-slate-50 mb-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Connected as</p>
            <p class="text-sm font-bold text-slate-800">{{ userName }}</p>
          </div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            @click="goToSettings"
            v-cursor
          >
            <Settings class="w-4 h-4 text-slate-400" />
            Account Settings
          </button>
          <div class="h-px bg-slate-100 my-1"></div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            @click="handleLogout"
            v-cursor
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/ModalStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { Bell, Plus, Menu, Bus, UserPlus, Settings, LogOut, ChevronDown, Send, CheckCircle2 } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    showMenu?: boolean
    showNotifications?: boolean
  }>(),
  {
    subtitle: 'Safety & Compliance',
    showMenu: true,
    showNotifications: true,
  },
)

const emit = defineEmits<{
  'open-mobile': []
}>()

const router = useRouter()
const modalStore = useModalStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const activeDropdown = ref<'add' | 'profile' | 'notifications' | null>(null)

// Compute user display name/initial
const userInitial = computed(() => {
  const email = authStore.user?.email
  if (!email) {
    return 'U'
  }
  return email.charAt(0).toUpperCase()
})

const userName = computed(() => {
  return authStore.user?.displayName || authStore.user?.email?.split('@')[0] || 'User'
})

// Real notifications from store
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

function toggleMenu(type: 'add' | 'profile' | 'notifications') {
  activeDropdown.value = activeDropdown.value === type ? null : type
  if (type === 'notifications' && activeDropdown.value === 'notifications') {
    notificationStore.fetchNotifications()
  }
}

function handleMarkAllRead() {
  notificationStore.markAllAsRead()
}

interface HeaderNotification {
  id: string
  entityId?: string
  entityName?: string
  read?: boolean
  message?: string
  dueDate?: string
  entity?: string
}

function handleNotificationClick(n: HeaderNotification) {
  notificationStore.markAsRead(n.id)
  if (n.entityId) {
    router.push({ name: 'drivers', query: { search: n.entityName } })
  }
  activeDropdown.value = null
}

async function handleAddDriver() {
  activeDropdown.value = null
  await router.push({ name: 'drivers' })
  modalStore.openModal('driver')
}

async function handleAddVehicle() {
  activeDropdown.value = null
  await router.push({ name: 'vehicles' })
  modalStore.openModal('vehicle')
}

function goToSettings() {
  activeDropdown.value = null
  router.push({ name: 'settings' })
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}

// Close dropdowns when clicking outside
function handleClickOutside(e: MouseEvent) {
  const target = e.target
  if (!(target instanceof HTMLElement)) return

  if (!target.closest('.header-menu')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  notificationStore.fetchNotifications() // Initial fetch
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
