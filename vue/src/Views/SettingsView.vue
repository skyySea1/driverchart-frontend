<!-- src/Views/SettingsView.vue -->
<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar Settings Nav -->
      <div class="space-y-2">
        <button
          v-for="item in menuItems"
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
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-black text-slate-800">{{ activeMenuLabel }}</h3>
          <p class="text-slate-500 text-sm italic">
            Manage your system preferences and configurations.
          </p>
        </div>

        <div class="p-6 space-y-6">
          <template v-if="activeSection === 'profile'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <InputGroup label="Administrator Name" type="text" modelValue="Henri Admin" />
              </div>
              <div class="space-y-1">
                <InputGroup label="Email Address" type="email" modelValue="admin@vuebus.com" />
              </div>
            </div>
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

          <template v-if="activeSection === 'security'">
            <div class="p-4 border border-amber-100 bg-amber-50 rounded-xl flex gap-3">
              <ShieldAlert class="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p class="text-sm font-bold text-amber-900">Two-Factor Authentication</p>
                <p class="text-xs text-amber-700 mt-1">
                  Enhance your account security by enabling 2FA. Currently disabled.
                </p>
                <button class="mt-3 text-xs font-black uppercase text-indigo-600 hover:underline">
                  Enable Now
                </button>
              </div>
            </div>
          </template>

          <div class="pt-6 border-t border-slate-100 flex justify-end">
            <BaseButton
              label="Save Changes"
              class="px-6 py-2 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Bell, LucideShieldX, Globe, ShieldAlert } from 'lucide-vue-next'
import InputGroup from '@/Components/ui/InputGroup.vue'
import BaseButton from '@/Components/ui/BaseButton.vue'

const activeSection = ref('profile')

const menuItems = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: LucideShieldX },
  { id: 'company', label: 'Organization', icon: Globe },
]

const activeMenuLabel = computed(() => menuItems.find((i) => i.id === activeSection.value)?.label)

const notifyOpts = [
  { label: 'Email Alerts', desc: 'Receive expiration notices via email.' },
  { label: 'Push Notifications', desc: 'In-app alerts for urgent compliance issues.' },
  { label: 'Weekly Summary', desc: 'Get a management report every Monday.' },
]
</script>
