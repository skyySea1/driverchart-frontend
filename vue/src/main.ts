import { createApp } from 'vue'
import App from './App.vue'
import router from './router.ts'
import './index.css'
import cursorDirective from './utils/pointerDirective.ts'

// async autentication before mounting the app for security reasons

const app = createApp(App)
app.use(router)
// create global directive for cursor pointer
app.directive('cursor', cursorDirective)
app.mount('#app')
