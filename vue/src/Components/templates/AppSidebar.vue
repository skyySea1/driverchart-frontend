<template>
  <aside
    :class="[
      'sidebar h-screen fixed left-0 top-0 w-64 transition-transform bg-slate-900 text-white print:hidden z-40 flex flex-col',
      collapsed ? '-translate-x-full md:-translate-x-56' : 'translate-x-0',
    ]"
  >
    <!-- TODO CONFIGURE ROUTE -->
    <!-- Logo Section -->
    <div
      v-cursor
      class="sidebarheader p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
      <div class="sidebarlogo w-10 h-10 rounded flex items-center justify-center shadow-lg">
        <Bus class="sidebarlogo-icon w-8 h-8 text-blue-400 pointer-events-none" />
      </div>

      <div v-show="!collapsed || collapsedMobile" class="sidebarbrand transition-opacity">
        <div class="sidebarbrand-name font-bold leading-tight">CharterSafe</div>
        <div class="sidebarbrand-tagline text-xs text-slate-400">DOT Compliance System</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2 mt-2 flex-1">
      <button
        v-cursor
        v-for="item in visibleNavItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          '-item flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors duration-200',
          currentRoute === item.id
            ? '-item--active bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <component :is="item.icon" class="-icon w-5 h-5 shrink-0 pointer-events-none" />
        <span
          :class="[
            '-label transition-opacity duration-300 whitespace-nowrap',
            { 'md:opacity-0': collapsed, 'md:opacity-100': !collapsed, 'opacity-100': true },
          ]"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- User Section (Footer) -->
    <footer class="sidebarfooter p-4 border-t border-slate-800">
      <UserBadge :show-info="!collapsed || collapsedMobile" @logout="handleLogout" />
      <div v-show="!collapsed || collapsedMobile" class="text-xs text-slate-500 text-center mt-3">
        &copy; 2025 CharterSafe
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserBadge from '../ui/UserBadge.vue'
import { LayoutDashboard, Code, Users, FileText, PieChart, Settings, Bus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  collapsed: Boolean,
  currentRoute: String,
})

defineEmits(['navigate', 'logout'])

// Helper to detect if we are effectively collapsed on mobile
const collapsedMobile = computed(() => !props.collapsed)

function handleLogout() {
  localStorage.setItem('isAuthenticated', 'false')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user_token')
  router.push('/login')
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'drivers', label: 'Drivers (DQ Files)', icon: Users },
  { id: 'vehicles', label: 'Fleet Maintenance', icon: Bus, hidden: true},
  { id: 'audit', label: ' Audit Reports', icon: PieChart },
  { id: 'docs', label: 'Document Registry', icon: FileText },
  { id: 'specs', label: 'System Specs', icon: Code },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'applications', label: 'Applications', icon: FileText },
]
// hidden items that are filtered out
const visibleNavItems = computed(() => navItems.filter((item) => !item.hidden))
</script>
