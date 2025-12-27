<template>
  <div
    v-cursor
      class="p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
        <div class="w-10 h-10 rounded flex items-center justify-center shadow-lg">
          <Truck class="-icon w-8 h-8 text-blue-400 pointer-events-none" />
      </div>
      <div  class=" transition-opacity">
        <div class="font-bold leading-tight">CharterSafe</div>
        <div class="text-xs text-slate-400">DOT Compliance System</div>
      </div>
    </div>
</template>
