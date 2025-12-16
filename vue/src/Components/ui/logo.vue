<template>
  <div
    v-cursor
      class="sidebar__header p-6 flex items-center gap-3 border-b border-slate-800 cursor-pointer"
      @click="$emit('navigate', 'dashboard')"
    >
      <div class="sidebar__logo w-10 h-10 rounded flex items-center justify-center shadow-lg">
        <Truck class="sidebar__logo-icon w-8 h-8 text-blue-400 pointer-events-none" />
      </div>
      <div  class="sidebar__brand transition-opacity">
        <div class="sidebar__brand-name font-bold leading-tight">CharterSafe</div>
        <div class="sidebar__brand-tagline text-xs text-slate-400">DOT Compliance System</div>
      </div>
    </div>
</template>
