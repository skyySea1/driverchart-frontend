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
          class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105 active:scale-95 duration-200 hover:bg-indigo-50/30 group relative"
          @click="toggleMenu('notifications')"
          aria-label="Notifications"
          v-cursor
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="notifications.length > 0"
            class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"
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
            <span class="text-[10px] font-bold text-indigo-600 cursor-pointer hover:underline"
              >Mark all read</span
            >
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div
              v-for="n in notifications"
              :key="n.id"
              class="p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 flex gap-3 group"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full mt-1.5 shrink-0',
                  n.read ? 'bg-slate-200' : 'bg-indigo-500 animate-pulse',
                ]"
              ></div>
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors"
                >
                  {{ n.title }}
                </p>
                <p class="text-xs text-slate-500 truncate">{{ n.desc }}</p>
                <p class="text-[9px] font-medium text-slate-400 mt-1">{{ n.time }}</p>
              </div>
            </div>
          </div>
          <div class="p-2 border-t border-slate-50 mt-1">
            <button
              class="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              View All Activities
            </button>
          </div>
        </div>
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
            H
          </div>
          <span class="text-sm font-bold text-slate-700 hidden sm:inline">Henri</span>
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
            <p class="text-sm font-bold text-slate-800">Henri Admin</p>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/ModalStore'
import { Bell, Plus, Menu, Bus, UserPlus, Settings, LogOut, ChevronDown } from 'lucide-vue-next'

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
const activeDropdown = ref<'add' | 'profile' | 'notifications' | null>(null)

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    title: 'Medical Expiring',
    desc: 'John Doe card expires in 5 days',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    title: 'New Application',
    desc: 'New driver applied for Florida route',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    title: 'Fleet Inspection',
    desc: 'Bus #104 inspection successfully logged',
    time: 'Yesterday',
    read: true,
  },
])

function toggleMenu(type: 'add' | 'profile' | 'notifications') {
  activeDropdown.value = activeDropdown.value === type ? null : type
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

function handleLogout() {
  localStorage.setItem('isAuthenticated', 'false')
  router.push('/login')
}

// Close dropdowns when clicking outside
function handleClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.header-menu')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
