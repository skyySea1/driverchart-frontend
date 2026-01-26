<!-- src/Views/SettingsView.vue -->
<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar Settings Nav -->
      <div class="space-y-2">
        <button
          v-cursor
          v-for="item in menuOptions"
          :key="item.id"
          @click="activeSection = item.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all',
            activeSection === item.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </button>
      </div>

      <!-- Main Settings Content -->
      <div
        class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <!-- Options container -->
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-black text-slate-800">{{ selectedOption }}</h3>
          <p class="text-slate-500 text-sm italic">
            Manage your system preferences and configurations.
          </p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Alert Feedback -->
          <div
            v-if="statusMsg"
            :class="[
              'px-4 py-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2',
              statusType === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200',
            ]"
          >
            <span>{{ statusMsg }}</span>
          </div>

          <template v-if="activeSection === 'profile'">
            <form @submit.prevent="saveProfile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <InputGroup
                  label="Display Name"
                  type="text"
                  v-model="formProfile.displayName"
                  placeholder="Enter your name"
                />
              </div>
              <div class="space-y-1">
                <InputGroup
                  label="Email Address"
                  type="email"
                  :modelValue="authStore.user?.email || ''"
                  disabled
                />
              </div>
              <div class="space-y-1">
                <InputGroup
                  label="Role"
                  type="text"
                  :modelValue="authStore.userRole || ''"
                  disabled
                />
              </div>
            </form>
          </template>

          <template v-if="activeSection === 'notifications'">
            <div class="space-y-4">
              <div
                v-for="opt in notifyOpts"
                :key="opt.label"
                class="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div>
                  <p class="font-bold text-slate-700 text-sm">{{ opt.label }}</p>
                  <p class="text-xs text-slate-500">{{ opt.desc }}</p>
                </div>
                <div class="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="activeSection === 'company'">
            <div class="space-y-4">
              <div class="space-y-1">
                <InputGroup
                  label="Organization Name"
                  type="text"
                  :modelValue="ORGANIZATION.name || ''"
                  disabled
                />
              </div>
              <div class="space-y-1">
                <InputGroup
                  label="Organization Domain"
                  type="text"
                  :modelValue="ORGANIZATION.domain || ''"
                  disabled
                />
              </div>
            </div>
          </template>

          <div class="pt-6 border-t border-slate-100 flex justify-end">
            <BaseButton
            :icon="Check"
              @click="saveProfile"
              :label="authStore.isLoading ? 'Saving...' : 'Save Changes'"
              :disabled="authStore.isLoading"
              class="px-6 py-2 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { User, Globe, Check } from 'lucide-vue-next'
import InputGroup from '@/Components/ui/InputGroup.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import { ORGANIZATION } from '@/utils/constants'
import { useAuthStore } from '@/stores/AuthStore'


const authStore = useAuthStore()
const activeSection = ref('profile')

const statusMsg = ref('')
const statusType = ref<'success' | 'error'>('success')

const formProfile = ref({
  displayName: '',
})

const menuOptions = [
  { id: 'profile', label: 'User Profile', icon: User },
  // temporary disabled { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'company', label: 'Organization', icon: Globe },
]

const selectedOption = computed(() => menuOptions.find((i) => i.id === activeSection.value)?.label)

const notifyOpts = [
  { label: 'Email Alerts', desc: 'Receive expiration notices via email.' },
  { label: 'Push Notifications', desc: 'In-app alerts for urgent compliance issues.' },
  { label: 'Weekly Summary', desc: 'Get a management report every Monday.' },
]

// Initialize form data
onMounted(() => {
  if (authStore.user?.displayName) {
    formProfile.value.displayName = authStore.user.displayName
  }
})

// Watch for user changes (e.g. reload) to populate if not ready on mount
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser?.displayName && !formProfile.value.displayName) {
      formProfile.value.displayName = newUser.displayName
    }
  },
  { immediate: true },
)

async function saveProfile() {
  if (activeSection.value !== 'profile') return

  try {
    statusMsg.value = ''
    await authStore.updateUserProfile({ displayName: formProfile.value.displayName })
    statusType.value = 'success'
    statusMsg.value = 'Profile updated successfully!'

    // Clear message after 3 seconds
    setTimeout(() => {
      statusMsg.value = ''
    }, 3000)
  } catch (error) {
    statusType.value = 'error'
    statusMsg.value = 'Failed to update profile.'
    console.error(error)
  }
}
</script>
