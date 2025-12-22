<template>
  <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-700 font-semibold border-b">
          <tr>
            <th
              v-for="col in props.columns"
              :key="col.key"
              :class="[
                'p-4 whitespace-nowrap',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : col.align === 'left' ? 'text-left' : ''  ,
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(item, index) in items"
            :key="item.id || index"
            class="hover:bg-slate-50 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'p-4 whitespace-nowrap',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
              ]"
            >
              <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                <span class="text-slate-600">{{ item[col.key] || '-' }}</span>
              </slot>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td :colspan="columns.length" class="p-8 text-center text-slate-500">
              <slot name="empty">No records found.</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Column {
  readonly key: string
  readonly label: string
  readonly align?: 'left' | 'center' | 'right'
}

const props = defineProps<{
 readonly columns: any[]
 readonly items: any[]
}>()
</script>
