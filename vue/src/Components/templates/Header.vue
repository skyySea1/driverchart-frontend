<template>
  <header class="w-full flex items-center justify-between gap-4 py-4">
    <div class="flex items-center gap-3">
      <button
        class="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        @click="emit('open-mobile')"
        aria-label="Abrir menu lateral"
        v-cursor
      >
        ☰
      </button>

      <div class="flex flex-col">
        <h1 class="text-xl md:text-2xl font-bold text-slate-900">{{ title }}</h1>
        <p v-if="subtitle" class="text-slate-500 text-sm mt-1">{{ subtitle }}</p>
      </div>
    </div>

    <div class="flex items-center gap-3 relative header-menu">
      <button
        v-if="showNotifications"
        class="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 shadow-sm transition-colors rounded-lg transition-all duration-200 hover:bg-slate-200  group"
        @click="emit('open-notifications')"
        aria-label="Notificações"
        v-cursor
      >
        <Bell/>
      </button>

      <div class="relative" v-if="showMenu">
        <button
          class="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 shadow-sm transition-colors"
          @click="toggleMenu"
          aria-label="Abrir menu de ações"
          v-cursor
        >
          <Plus />
        </button>

        <div
          v-if="menuOpen"
          class="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <button
            class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            @click="handleAddDriver"
            v-cursor
          >
            Adicionar Driver
          </button>
          <button
            class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            @click="handleAddVehicle"
            v-cursor
          >
            Adicionar Vehicle
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Bell, Plus } from 'lucide-vue-next';

const { title, subtitle, showMenu, showNotifications } = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    showMenu?: boolean
    showNotifications?: boolean
  }>(),
  {
    title: 'PhoenixBus',
    subtitle: '',
    showMenu: true,
    showNotifications: true,
  },
)

const emit = defineEmits<{
  'open-mobile': []
  'open-notifications': []
  'open-add-driver': []
  'open-add-vehicle': []
}>()

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleAddDriver() {
  menuOpen.value = false
  emit('open-add-driver')
}

function handleAddVehicle() {
  menuOpen.value = false
  emit('open-add-vehicle')
}

function handleClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.header-menu')) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
