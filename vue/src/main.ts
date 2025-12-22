import { createApp } from 'vue'
import App from './App.vue'
import router from './router.ts'
import './index.css'
import cursorDirective from './utils/pointerDirective.ts'
// asyns autentication before mounting the app
const app = createApp(App)
app.use(router)
// create global directive for cursor pointer
app.directive('cursor', cursorDirective)
app.mount('#app')
