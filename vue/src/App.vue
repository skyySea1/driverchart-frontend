<template>
  <div class="mmin-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col md:flex-row print:bg-white relative">
    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="sidebarCollapsed = true"
    ></div>

    <Sidebar :collapsed="sidebarCollapsed" :currentRoute="route" @navigate="navigate" />

    <!-- Main Content Area -->
    <div
      :class="[
        'min-h-screen transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64',
      ]"
    >
      <div class="p-4 md:p-8">
        <Header @open-mobile="sidebarCollapsed = !sidebarCollapsed" />

        <main class="mt-8">
          <div class="max-w-7xl mx-auto">
            <component :is="viewComponent" @navigate="navigate" />
          </div>
        </main>
      </div>
    </div>

    <!-- Desktop Collapse Toggle Button -->
    <button
      @click="toggleSidebar"
      :class="[
        ' hidden md:flex fixed top-1/2 z-40 bg-slate-800 shadow-md border  border-indigo-600 rounded-full p-1.5 items-center justify-center text-white hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'left-10' : 'left-60',
      ]"
      title="Toggle Sidebar"
    >
      <Arrow
        :class="['w-4 h-4 transition-transform duration-300', sidebarCollapsed ? 'rotate-180' : '']"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft as Arrow } from 'lucide-vue-next'
import Sidebar from './Components/Sidebar.vue'
import Header from './Components/Header.vue'
import Dashboard from './Components/Dashboard.vue'
import Drivers from './Views/Drivers.vue'
import Vehicles from './Views/Vehicles.vue'
import SystemSpecs from './Views/SystemSpecs.vue'
import DocumentRegistry from './Views/DocumentRegistry.vue'
import Reports from './Views/Reports.vue'
import { initAuth } from './utils/firebase'

const route = ref('dashboard')
// Default to false (open) on desktop, logic handled by CSS classes mostly,
// but for mobile we might want it true (hidden) by default.
// Let's rely on the user closing it or initial state.
const sidebarCollapsed = ref(window.innerWidth < 768)

const viewComponent = computed(() => {
  return {
    dashboard: Dashboard,
    drivers: Drivers,
    vehicles: Vehicles,
    docs: DocumentRegistry,
    reports: Reports,
    systemSpecs: SystemSpecs,
  }[route.value]
})

function navigate(to) {
  route.value = to
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true // Close sidebar on mobile nav
  }
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

onMounted(async () => {
  await initAuth()
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebarCollapsed.value) {
      // Optional: Auto open on desktop resize? Maybe not, preserve user preference.
    }
  })
})
</script>
