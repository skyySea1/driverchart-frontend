<template>
  <aside
    :class="[
      'h-screen fixed left-0 top-0 w-64 transition-transform bg-slate-900 text-white print:hidden z-40 flex flex-col',
      props.collapsed ? '-translate-x-full md:-translate-x-56' : 'translate-x-0',
    ]"
  >
    <!-- Logo Section -->
    <div
      v-cursor
      class="p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
      <div class="w-10 h-10 rounded flex items-center justify-center shadow-lg">
        <Bus class="w-8 h-8 text-blue-400 pointer-events-none" />
      </div>

      <div v-show="!props.collapsed" class="transition-opacity">
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
        :data-testid="`nav-item-${item.id}`"
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
      <UserBadge :show-info="!props.collapsed" />
      <div v-show="!props.collapsed" class="text-xs text-slate-500 text-center mt-3">
        &copy; 2025 CharterSafe
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserBadge from '@/Components/ui/UserBadge.vue'
import { LayoutDashboard, Truck, Settings, Bus, UserPlus, ShieldCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/AuthStore'

const props = defineProps<{
  collapsed: boolean
  currentRoute?: string
}>()
defineEmits<{ navigate: [id: string] }>()

const authStore = useAuthStore()

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Fleet Maintenance', icon: Truck, hidden: false },
  { id: 'applications', label: 'Applications', icon: UserPlus },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'user-management', label: 'Users Management', icon: ShieldCheck, requiresAdmin: true },
]

// Filter nav items based on visibility and permissions
const visibleNavItems = computed(() => {
  return navItems.filter((item) => {
    if (item.hidden) return false
    if (item.requiresAdmin && authStore.user?.role !== 'Admin') return false
    return true
  })
})
</script>
