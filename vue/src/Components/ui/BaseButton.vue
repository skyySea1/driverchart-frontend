<template>
  <button
    @click="$emit('click')"
    type="button"
    class="
      btn-up-hover-effect
      px-4 py-2 rounded-lg
      bg-indigo-600 text-white
      flex items-center gap-2
      shadow
      transition-all duration-200
      hover:bg-indigo-700 hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      focus:outline-none focus:ring-2 focus:ring-indigo-400
      cursor-pointer
    "
  >

    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>
