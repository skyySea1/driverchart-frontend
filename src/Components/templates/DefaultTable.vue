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
              :class="[ 'p-4 whitespace-nowrap', col.align === 'center' ? 'text-center' : col.align === 'right'? 'text-right': col.align === 'left'? 'text-left' : '', ]">
              {{ col.label }}
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
            <tr v-for="(item, index) in props.items" :key="item.id || index" class="hover:bg-slate-50 transition-colors">
              <td v-for="col in props.columns" :key="col.key" :class="[ 'p-4 whitespace-nowrap',
                   col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '', ]">
                <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                  <span class="text-slate-600">{{ item[col.key] || '-' }}</span>
                </slot>
              </td>
            </tr>

            <tr v-if="props.items.length === 0">
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
import type { Column } from '@/types'

const props = defineProps<{
  readonly columns: Column[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly items: any[]
  readonly loading?: boolean
}>()
</script>
