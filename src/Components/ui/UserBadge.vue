<template>
  <div
    class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-slate-800 group"
  >
    <!-- Avatar Icon -->
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 bg-blue-600 group-hover:bg-blue-500"
    >
      <User class="w-5 h-5 text-white" />
    </div>

    <!-- User Info -->
    <div v-show="showInfo" class="flex-1 min-w-0 transition-opacity duration-200">
      <div class="text-sm font-medium text-white truncate">
        {{ authStore.userDisplayName }}
      </div>
      <div class="text-xs text-slate-400 truncate">{{ authStore.userRole }}</div>
    </div>

    <!-- Logout Button -->
    <SmallButton
      :icon="LogOut"
      v-cursor
      v-show="showInfo"
      @click.stop="handleLogout"
      class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
      title="Logout"
      aria-label="Logout"
    >
    </SmallButton>
  </div>
</template>

<script setup lang="ts">
import { User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/AuthStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SmallButton from '@/Components/ui/buttons/SmallButton.vue'

const props = defineProps<{
  showInfo?: boolean
}>()
const showInfo = computed(() => props.showInfo ?? true)
const authStore = useAuthStore()
const router = useRouter()

// Logout handler
async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>
