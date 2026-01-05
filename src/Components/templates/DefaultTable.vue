<!-- src/Components/templates/DefaultTable.vue -->
<template>
  <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200 w-full">
    <div class="overflow-x-auto w-full">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="bg-slate-50 text-slate-700 font-semibold border-b">
          <tr>
            <th
              v-for="col in props.columns"
              :key="col.key"
              :class="[
                'p-4 whitespace-nowrap transition-colors select-none',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                col.sortable ? 'cursor-pointer hover:bg-slate-100 group' : ''
              ]"
              @click="col.sortable ? toggleSort(col.key) : null"
            >
              <div :class="['flex items-center gap-1', col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start']">
                {{ col.label }}
                <!-- Sort Icon -->
                <span v-if="col.sortable" class="text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <ArrowUp v-if="sortKey === col.key && sortOrder === 'asc'" class="w-3.5 h-3.5" />
                  <ArrowDown v-else-if="sortKey === col.key && sortOrder === 'desc'" class="w-3.5 h-3.5" />
                  <ChevronsUpDown v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">

          <!-- Skeleton State -->
          <template v-if="props.loading">
            <tr v-for="i in 5" :key="i" >
              <td v-cursor v-for="col in props.columns" :key="col.key" class="p-4">
                <div
                  :class="['h-4 skeleton rounded', col.align === 'center' ? 'mx-auto w-12' : col.align === 'right' ? 'ml-auto w-16' : 'w-24', ]">
                </div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr v-for="(item, index) in sortedItems" :key="item.id || index" class="hover:bg-slate-50 transition-colors">
              <td v-for="col in props.columns" :key="col.key" :class="[ 'p-4 whitespace-nowrap',
                   col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '', ]">
                <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                  <span class="text-slate-600">{{ item[col.key] || '-' }}</span>
                </slot>
              </td>
            </tr>

            <tr v-if="sortedItems.length === 0">
              <td :colspan="props.columns.length" class="p-8 text-center text-slate-500">
                <slot name="empty">No records found.</slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Column } from '@/types'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-vue-next'

const props = defineProps<{
  readonly columns: Column[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly items: any[]
  readonly loading?: boolean
}>()

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortedItems = computed(() => {
  if (!sortKey.value) return props.items

  return [...props.items].sort((a, b) => {
    const valA = a[sortKey.value!]
    const valB = b[sortKey.value!]

    // Handle null/undefined - push to bottom
    if (valA === null || valA === undefined) return 1
    if (valB === null || valB === undefined) return -1

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})
</script>
