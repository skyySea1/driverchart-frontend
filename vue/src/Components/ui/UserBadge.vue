<template>
  <div
    class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-slate-800 group"
  >
    <!-- Avatar Icon -->
    <div
      :class="[
        ' w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110',
        setAvatarColor,
      ]"
    >
      <User class="w-5 h-5 text-white" />
    </div>

    <!-- User Info -->
    <div v-show="showInfo" class=" flex-1 min-w-0 transition-opacity duration-200">
      <div class=" text-sm font-medium text-white truncate">
        {{ userName }}
      </div>
      <div class="text-xs text-slate-400 truncate">
        {{ userRole }}
      </div>
    </div>

    <!-- Logout Button -->
    <button
      v-cursor
      v-show="showInfo"
      @click.stop="handleLogout"
      class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
      title="Logout"
      aria-label="Logout"
    >
      <LogOut @click="handleLogout" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, LogOut } from 'lucide-vue-next'
import router from '@/router'

interface Props {
  showInfo?: boolean
  // Firebase user data (when ready)
  user?: {
    displayName?: string
    email?: string
    photoURL?: string
    gender?: 'male' | 'female'
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  showInfo: true,
  user: null,
})

const emit = defineEmits<{
  logout: []
}>()

// Mock user data (replace with Firebase auth when ready)
const mockUser = {
  displayName: 'Manoel Ribeiro',
  email: 'mneto@phoenixbusorlando.com',
  role: 'Administrator',
  gender: 'male'
}

// User info computed properties
const currentUser = computed(() => props.user || mockUser)

const userName = computed(() => {
  return currentUser.value.displayName || currentUser.value.email || 'User'
})

const userRole = computed(() => {
  // @ts-ignore - temporary mock data
  return currentUser.value.role || 'User'
})

const setAvatarColor = computed(() => {
  const gender = currentUser.value.gender || 'male'
  return gender === 'male'
    ? 'bg-blue-600 group-hover:bg-blue-500'
    : 'bg-pink-600 group-hover:bg-pink-500'
})

// Logout handler
function handleLogout() {
  // TODO: Implement Firebase logout
  emit('logout')
  router.push('/login')
  console.log('Logout clicked')
}
</script>
