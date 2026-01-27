<!-- src/Components/templates/AppLayout.vue -->
<template>
  <div
    class="h-screen overflow-auto bg-slate-100 font-sans text-slate-800 md:flex-row print:bg-white relative"
  >
    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="sidebarCollapsed = true"
      v-cursor
    ></div>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :currentRoute="currentRouteName"
      @navigate="handleNavigate"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'h-screen flex-1 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64',
      ]"
    >
      <!-- access route title and subtitle by route meta -->
      <div class="p-4 md:p-8">
        <AppHeader
          :title="title"
          :subtitle="subtitle"
          @open-mobile="sidebarCollapsed = !sidebarCollapsed"
        />

        <main class="mt-4">
          <div class="w-full">
            <RouterView />
          </div>
        </main>
      </div>
    </div>

    <!-- Desktop Collapse Toggle Button -->
    <button
      v-cursor
      @contextmenu.prevent="toggleSidebar"
      @click="toggleSidebar"
      :class="[
        'hidden btn-up-hover-effect md:flex fixed top-1/2 z-40 bg-slate-800 shadow-md border border-indigo-600 rounded-full p-1.5 items-center justify-center text-white hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'left-10' : 'left-60',
      ]"
      title="Toggle Sidebar"
    >
      <ChevronLeft
        :class="['w-4 h-4 transition-transform duration-300', sidebarCollapsed ? 'rotate-180' : '']"
      />
    </button>

    <FloatingAiAssistant />

    <!-- Global Notification Modal -->
    <NotificationPreviewModal
      :is-open="modalStore.activeModal === 'notification'"
      :notifications="expiringNotifications"
      :loading-data="notificationsLoading"
      @close="modalStore.closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import FloatingAiAssistant from '@/Components/templates/FloatingAiAssistant.vue'
import NotificationPreviewModal from '@/Components/templates/modals/NotificationPreviewModal.vue'
import { useModalStore } from '@/stores/ModalStore'
import { useNotifications } from '@/Composables/useNotifications'
import { MOBILE_BREAKPOINT } from '@/utils/constants'

const router = useRouter()
const route = useRoute()
const modalStore = useModalStore()
const { expiringNotifications, loading: notificationsLoading } = useNotifications()

const currentRouteName = computed(() => String(route.name ?? 'dashboard'))
const title = computed(() => String(route.meta.title ?? 'Dashboard'))
const subtitle = computed(() => String(route.meta.subtitle ?? ''))

// Sidebar state: closed on mobile (< 768px)
const sidebarCollapsed = ref(window.innerWidth < MOBILE_BREAKPOINT)

function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function handleNavigate(routeName: string) {
  if (route.name === routeName) return
  router.push({ name: routeName })
  // Auto-close sidebar on mobile after navigation
  if (isMobile()) {
    sidebarCollapsed.value = true
  }
}

// sidebar event handler
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

onMounted(() => {
  window.addEventListener('resize', () => {
    // Auto-open sidebar when resizing to desktop
    if (!isMobile() && sidebarCollapsed.value) {
      sidebarCollapsed.value = false
    }
  })
})
</script>
