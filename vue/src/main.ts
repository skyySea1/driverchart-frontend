import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import cursorDirective from './utils/pointerDirective.ts'

const app = createApp(App)
app.use(router)
app.directive('cursor', cursorDirective)
app.mount('#app')
