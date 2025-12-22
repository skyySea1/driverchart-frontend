<template>
  <div class="h-screen overflow-auto bg-slate-100 font-sans text-slate-800  md:flex-row print:bg-white relative">
    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="sidebarCollapsed = true"
      v-cursor
    ></div>

    <Sidebar :collapsed="sidebarCollapsed" :currentRoute="$route.name?.toString()" @navigate="handleNavigate" />

    <!-- Main Content Area -->
    <div
      :class="[
        'h-screen flex-10  transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64',
      ]"
    >
      <div class="p-4 md:p-8">
        <Header title="Safety Dashboard" @open-mobile="sidebarCollapsed = !sidebarCollapsed" />

        <main class="mt-2 flex">
          <div class="max-w-7xl mx-auto">
            <RouterView  />
          </div>
        </main>
      </div>
    </div>

    <!-- Desktop Collapse Toggle Button -->
    <button
      v-cursor
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { MOBILE_BREAKPOINT } from '@/utils/constants'

const router = useRouter()

// Sidebar state: closed on mobile (< 768px)
const sidebarCollapsed = ref(window.innerWidth < MOBILE_BREAKPOINT)

// Helper to check if current viewport is mobile
const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT

function handleNavigate(routeName: string) {
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
