<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
    v-cursor
    type="button"
      class="group inline-flex items-center justify-between w-full min-w-40 gap-x-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="toggleDropdown">
      <div class="flex items-center gap-2">
        <Filter class="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
        <span>Filters</span>
        <span
          v-if="totalActiveCount > 0"
          class="inline-flex items-center justify-center w-5 h-5 ml-1 text-[10px] font-bold text-blue-600 bg-blue-100 rounded-full animate-in zoom-in duration-200"
        >
          {{ totalActiveCount }}
        </span>
      </div>

      <!-- Dynamic Clear Icon (appears when filters are active) -->
      <div
        v-if="totalActiveCount > 0"
        @click.stop="clearAll"
        class="p-1 -mr-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-indigo-700 transition-colors"
        title="Clear all filters"
      >
        <X class="h-3.5 w-3.5" />
      </div>
      <ChevronDown v-else class="-mr-1 h-4 w-4 text-slate-400 group-hover:text-slate-600" aria-hidden="true" />
    </button>

    <!-- Dropdown Panel -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-blue-300 ring-opacity-5 focus:outline-none divide-y divide-slate-100"
      >
        <!-- Categories Loop -->
        <div v-for="(group, groupKey) in options" :key="groupKey" class="p-3">
          <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            {{ group.label }}
          </h3>
          <div class="space-y-1">
            <label
              v-for="option in group.items"
              :key="option.value"
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors group/item select-none"
            >
              <div class="relative flex items-center">
                <input
                  type="checkbox"
                  class="peer h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                  :checked="isChecked(groupKey, option.value)"
                  @change="toggleSelection(groupKey, option.value)"
                />
                <!-- Custom Checkbox Animation Helper could go here, but using standard accent-color for KISS -->
              </div>
              <span
                class="text-sm text-slate-700 font-medium group-hover/item:text-blue-700 transition-colors"
                :class="{ 'text-blue-700': isChecked(groupKey, option.value) }"
              >
                {{ option.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Footer / Actions -->
        <div class="bg-slate-50 p-2 rounded-b-xl flex justify-between items-center" v-if="totalActiveCount > 0">
           <button
            v-cursor
             @click="clearAll"
             class="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1 rounded transition-colors"
           >
             Clear All
           </button>
           <button
           v-cursor
             @click="isOpen = false"
             class="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow-sm transition-all"
           >
             Done
           </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Filter, ChevronDown, X } from 'lucide-vue-next'

// Types
export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  label: string
  items: FilterOption[]
}

export type FilterOptions = Record<string, FilterGroup>
export type FilterState = Record<string, string[]> // groupKey -> array of selected values

const props = defineProps<{
  options: FilterOptions
  modelValue: FilterState
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterState): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Computed for total active filters badge
const totalActiveCount = computed(() => {
  let count = 0
  for (const key in props.modelValue) {
    if (Array.isArray(props.modelValue[key])) {
      count += props.modelValue[key].length
    }
  }
  return count
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function isChecked(groupKey: string, value: string): boolean {
  return props.modelValue[groupKey]?.includes(value) ?? false
}

function toggleSelection(groupKey: string, value: string) {
  const currentSelection = [...(props.modelValue[groupKey] || [])]
  const index = currentSelection.indexOf(value)

  if (index === -1) {
    currentSelection.push(value)
  } else {
    currentSelection.splice(index, 1)
  }

  // Emit new object state
  emit('update:modelValue', {
    ...props.modelValue,
    [groupKey]: currentSelection
  })
}

function clearAll() {
  // Create an empty state based on keys
  const emptyState: FilterState = {}
  for (const key in props.options) {
    emptyState[key] = []
  }
  emit('update:modelValue', emptyState)
}

// Click outside to close
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
