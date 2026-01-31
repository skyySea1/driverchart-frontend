<template>
  <div class="relative w-full lg:max-w-xl">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
      <Search class="w-4 h-4" />
    </div>
    <input
      v-model="localSearch"
      type="text"
      placeholder="Search drivers..."
      class="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-2.5 pl-10"
    />
    <button
      v-if="localSearch"
      @click="localSearch = ''"
      class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 ease-in-out"
    >
      <X class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const localSearch = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>