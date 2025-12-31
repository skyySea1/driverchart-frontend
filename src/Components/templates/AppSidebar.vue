<template>
  <aside
    :class="[
      'h-screen fixed left-0 top-0 w-64 transition-transform bg-slate-900 text-white print:hidden z-40 flex flex-col',
      props.collapsed ? '-translate-x-full md:-translate-x-56' : 'translate-x-0',
    ]"
  >
    <!-- TODO CONFIGURE ROUTE -->
    <!-- Logo Section -->
    <div
      v-cursor
      class="p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
      <div class="w-10 h-10 rounded flex items-center justify-center shadow-lg">
        <Bus class="w-8 h-8 text-blue-400 pointer-events-none" />
      </div>

      <div v-show="!props.collapsed || collapsedMobile" class="sidebar__brand transition-opacity">
        <div class="font-bold leading-tight">CharterSafe</div>
        <div class="text-xs text-slate-400">DOT Compliance System</div>
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
          props.currentRoute === item.id
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <component :is="item.icon" class="-icon w-5 h-5 shrink-0 pointer-events-none" />
        <span
          :class="[
            'font-medium transition-opacity duration-300 whitespace-nowrap',
            {
              'md:opacity-0': props.collapsed,
              'md:opacity-100': !props.collapsed,
              'opacity-100': true,
            },
          ]"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- User Section (Footer) -->
    <footer class="sidebar__footer p-4 border-t border-slate-800">
      <UserBadge :show-info="!props.collapsed || collapsedMobile" />
      <div
        v-show="!props.collapsed || collapsedMobile"
        class="text-xs text-slate-500 text-center mt-3"
        @click="handleLogout"
      >
        &copy; 2025 CharterSafe
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import UserBadge from '@/Components/ui/UserBadge.vue'
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  PieChart,
  Settings,
  Bus,
} from 'lucide-vue-next'

const props = defineProps<{
  collapsed: boolean
  currentRoute?: string
}>()
const authStore = useAuthStore()
defineEmits(['navigate', 'logout'])

// Helper to detect if we are effectively collapsed on mobile
const collapsedMobile = computed(() => !props.collapsed)

async function handleLogout() {
  await authStore.logout()
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'drivers', label: 'Drivers (DQ Files)', icon: Users },
  { id: 'vehicles', label: 'Fleet Maintenance', icon: Truck, hidden: true },
  { id: 'audit', label: ' Audit Reports', icon: PieChart },
  { id: 'docs', label: 'Document Registry', icon: FileText },
  { id: 'applications', label: 'Applications', icon: FileText },
  // { id: 'specs', label: 'System Specs', icon: Code },
  { id: 'reports', label: 'Main Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]
// hidden items that are filtered out
const visibleNavItems = computed(() => navItems.filter((item) => !item.hidden))
</script>
