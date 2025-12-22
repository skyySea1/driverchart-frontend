import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Lazy load
const Login = () => import('@/Views/Login.vue')
const AppLayout = () => import('@/Components/templates/AppLayout.vue')
const Dashboard = () => import('@/Components/templates/Dashboard.vue')
const Drivers = () => import('@/Views/Drivers.vue')
const Vehicles = () => import('@/Views/Vehicles.vue')
const DocumentRegistry = () => import('@/Views/DocumentRegistry.vue')
const Reports = () => import('@/Views/Reports.vue')
const SystemSpecs = () => import('@/Views/SystemSpecs.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'drivers', name: 'drivers', component: Drivers },
      { path: 'vehicles', name: 'vehicles', component: Vehicles },
      { path: 'docs', name: 'docs', component: DocumentRegistry },
      { path: 'reports', name: 'reports', component: Reports },
      { path: 'specs', name: 'specs', component: SystemSpecs },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  // TODO: Replace with real Firebase auth check
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'false'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
