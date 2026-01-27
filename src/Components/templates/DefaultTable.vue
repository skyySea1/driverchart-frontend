<!-- src/Components/templates/DefaultTable.vue -->
<template>
  <div
    class="bg-white rounded-lg shadow overflow-hidden border border-slate-200 w-full transition-all duration-300"
  >
    <div class="overflow-x-auto w-full">
      <table :class="['w-full text-left border-collapse', props.compact ? 'text-xs' : 'text-sm']">
        <thead class="bg-slate-50 text-slate-700 font-semibold border-b">
          <tr>
            <th
              v-for="col in props.columns"
              :key="col.key"
              :class="[
                props.compact ? 'p-2' : 'p-4',
                'whitespace-nowrap select-none transition-colors',
                col.align === 'center'
                  ? 'text-center'
                  : col.align === 'right'
                    ? 'text-right'
                    : col.align === 'left'
                      ? 'text-left'
                      : '',
                col.sortable ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900' : '',
              ]"
              @click="col.sortable ? handleSort(String(col.key)) : null"
            >
              <div
                class="flex items-center gap-1"
                :class="{
                  'justify-center': col.align === 'center',
                  'justify-end': col.align === 'right',
                  'justify-start': col.align === 'left' || !col.align,
                }"
              >
                {{ col.label }}
                <span v-if="col.sortable" class="text-slate-400">
                  <ChevronUp
                    v-if="props.currentSortKey === col.key && props.currentSortOrder === 'asc'"
                    class="w-4 h-4 text-blue-600"
                  />
                  <ChevronDown
                    v-else-if="
                      props.currentSortKey === col.key && props.currentSortOrder === 'desc'
                    "
                    class="w-4 h-4 text-blue-600"
                  />
                  <ChevronsUpDown v-else class="w-4 h-4 opacity-50 hover:opacity-100" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <!-- Skeleton State -->
          <template v-if="props.loading">
            <tr v-for="i in 5" :key="i">
              <td
                v-for="col in props.columns"
                :key="col.key"
                :class="props.compact ? 'p-2' : 'p-4'"
              >
                <div
                  :class="[
                    'h-4 skeleton rounded',
                    col.align === 'center'
                      ? 'mx-auto w-12'
                      : col.align === 'right'
                        ? 'ml-auto w-16'
                        : 'w-24',
                  ]"
                ></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(item, index) in props.items"
              :key="item.id || index"
              class="hover:bg-slate-50 transition-colors cursor-pointer select-none"
              @click="emit('row-click', item)"
              @dblclick="emit('row-dblclick', item)"
            >
              <td
                v-for="col in props.columns"
                :key="col.key"
                :class="[
                  props.compact ? 'p-2' : 'p-4',
                  'whitespace-nowrap',
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                      ? 'text-right'
                      : '',
                ]"
              >
                <slot :name="`cell(${String(col.key)})`" :item="item" :value="item[col.key]">
                  <span class="text-slate-600">{{ item[col.key] || '-' }}</span>
                </slot>
              </td>
            </tr>

            <tr v-if="props.items.length === 0">
              <td :colspan="props.columns.length" class="p-8 text-center text-slate-500 min-h-50">
                <div class="py-20">
                  <slot name="empty">No records found.</slot>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import type { Column, SortOrder } from '@/types'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next'

const props = defineProps<{
  readonly columns: Column<T>[]
  readonly items: T[]
  readonly loading?: boolean
  readonly currentSortKey?: string
  readonly currentSortOrder?: SortOrder
  readonly compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'row-dblclick', item: T): void
  (e: 'row-click', item: T): void
  (e: 'sort', payload: { key: string; order: SortOrder }): void
}>()

function handleSort(key: string) {
  let newOrder: SortOrder = 'asc'

  if (props.currentSortKey === key) {
    if (props.currentSortOrder === 'asc') newOrder = 'desc'
    else if (props.currentSortOrder === 'desc') newOrder = null
  }

  emit('sort', { key, order: newOrder })
}
</script>
