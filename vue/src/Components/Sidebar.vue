<!-- filepath: /home/henri/Documentos/vuebus/vue/src/Components/Sidebar.vue -->
<template>
  <aside
    :class="[
      'sidebar h-screen fixed left-0 top-0 w-64 transition-transform bg-slate-900 text-white print:hidden z-40',
      collapsed ? '-translate-x-full md:-translate-x-56' : 'translate-x-0',
    ]"
  >
    <!-- Logo Section -->
    <div
      class="sidebar__header p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
      <div class="sidebar__logo w-10 h-10 rounded flex items-center justify-center shadow-lg">
        <Truck class="sidebar__logo-icon w-8 h-8 text-blue-400 pointer-events-none" />
      </div>
      <div v-show="!collapsed || collapsedMobile" class="sidebar__brand transition-opacity">
        <div class="sidebar__brand-name font-bold leading-tight">CharterSafe</div>
        <div class="sidebar__brand-tagline text-xs text-slate-400">DOT Compliance System</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav p-4 space-y-2 mt-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'sidebar__nav-item flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors duration-200',
          currentRoute === item.id
            ? 'sidebar__nav-item--active bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <component :is="item.icon" class="sidebar__nav-icon w-5 h-5 shrink-0 pointer-events-none" />
        <span
          :class="[
            'sidebar__nav-label transition-opacity duration-300 whitespace-nowrap',
            { 'md:opacity-0': collapsed, 'md:opacity-100': !collapsed, 'opacity-100': true }
          ]"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <!-- User Section (Footer) -->
    <footer class="sidebar__footer p-4 border-t border-slate-800">
      <div class="sidebar__user flex items-center gap-3">
        <div class="sidebar__user-avatar w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          <User class="w-5 h-5 text-white" />
        </div>
        <div v-show="!collapsed || collapsedMobile" class="sidebar__user-info flex-1 min-w-0">
          <div class="sidebar__user-name text-sm font-medium truncate">Manoel Passos</div>
          <div class="sidebar__user-role text-xs text-slate-400 truncate">Administrator</div>
        </div>
        <button
          v-show="!collapsed || collapsedMobile"
          class="sidebar__logout p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Logout"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </footer>
    <footer class="sidebar__footer mt-auto p-4 text-xs text-slate-500 border-t border-slate-800">
      &copy; 2025 PhoenixBus
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, Code, Users, Truck, FileText, PieChart } from 'lucide-vue-next'

const props = defineProps({
  collapsed: Boolean,
  currentRoute: String,
})

defineEmits(['navigate'])

// Helper to detect if we are effectively collapsed on mobile (since the prop might mean 'minimized' on desktop but 'hidden' on mobile)
// Actually, the CSS classes handle the logic:
// Mobile: collapsed ? '-translate-x-full' (hidden) : 'translate-x-0' (shown)
// Desktop: collapsed ? '-translate-x-56' (icon only) : 'translate-x-0' (full)
// Wait, logical correction:
// On mobile, if 'collapsed' is true (default), it should be hidden off-screen.
// On desktop, if 'collapsed' is true, it shows icons only.

const collapsedMobile = computed(() => !props.collapsed)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'drivers', label: 'Drivers (DQ Files)', icon: Users },
  { id: 'vehicles', label: 'Fleet Maintenance', icon: Truck },
  { id: 'reports', label: ' Audit Reports', icon: PieChart },
  { id: 'docs', label: 'Document Registry', icon: FileText },
  { id: 'specs', label: 'System Specs', icon: Code },
]
</script>
