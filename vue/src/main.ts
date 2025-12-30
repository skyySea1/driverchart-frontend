import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import cursorDirective from './utils/pointerDirective'
import { useAuthStore } from './stores/AuthStore'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  try {
    const authStore = useAuthStore()
    await authStore.init()
  }
  catch (error) {
    console.error('Failed to initialize authentication:', error)
  }

  app.use(router)
  app.directive('cursor', cursorDirective)
  app.mount('#app')
}

bootstrap()
