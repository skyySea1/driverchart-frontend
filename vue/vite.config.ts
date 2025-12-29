import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    Components({
      resolvers: [IconsResolver({ prefix: 'Icon' })],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    sourcemap: false,
    
  },
})
