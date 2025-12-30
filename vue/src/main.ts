import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.ts'
import './index.css'
import cursorDirective from './utils/pointerDirective.ts'

// async authentication before mounting the app for security reasons

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// create global directive for cursor pointer
app.directive('cursor', cursorDirective)

app.mount('#app')
