<template>
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Search by name..."
    class="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-2.5 pl-9"
  />
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
    <Search class="w-4 h-4" />
  </div>
  <button
    v-if="searchQuery"
    @click="searchQuery = ''"
    class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
  >
    <X class="w-3 h-3" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, X } from 'lucide-vue-next'
const searchQuery = ref('')
</script>
