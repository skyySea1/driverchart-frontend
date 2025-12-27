<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50 text-slate-600 text-sm uppercase">
          <th
            v-for="col in columns"
            :key="col.key"
            class="p-4 border-b"
            :class="col.align === 'right' && 'text-right'"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y text-sm">
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="p-8 text-center text-slate-400">
            {{ emptyText }}
          </td>
        </tr>

        <tr v-for="(row, i) in rows" :key="i" class="hover:bg-slate-50">
          <td
            v-for="col in columns"
            :key="col.key"
            class="p-4"
            :class="row[`${col.key}Class`]"
          >
            <!-- Check if slot exists for this column, otherwise default text -->
             <slot :name="`cell(${col.key})`" :value="row[col.key]" :item="row">
               {{ row[col.key] }}
             </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Column } from '@/types'

defineProps({
  columns: {
    type: Array as () => Column[],
    default: () => []
  },
  rows: {
    type: Array as () => Record<string, unknown>[],
    default: () => []
  },
  emptyText: { type: String, default: 'No data' }
})
</script>
