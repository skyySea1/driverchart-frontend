import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import cursorDirective from './utils/pointerDirective'
import { initAuth } from './services/firebase'

async function bootstrap() {
  try {
    await initAuth()
  } catch (error) {
    console.error('Failed to initialize authentication:', error)

  }
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.directive('cursor', cursorDirective)
  app.mount('#app')
}

bootstrap()
