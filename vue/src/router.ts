// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Lazy load views
const Login = () => import('@/Views/Login.vue')
const AppLayout = () => import('@/Components/templates/AppLayout.vue')
const Dashboard = () => import('@/Views/Dashboard.vue')
const Drivers = () => import('@/Views/Drivers.vue')
const Vehicles = () => import('@/Views/Vehicles.vue')
const DocumentRegistry = () => import('@/Views/DocumentRegistry.vue')
const Reports = () => import('@/Views/Reports.vue')
const SystemSpecs = () => import('@/Views/SystemSpecs.vue')
const Settings = () => import('@/Views/Settings.vue')

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
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Safety & Compliance Overview',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'drivers',
        name: 'drivers',
        component: Drivers,
        meta: {
          title: 'Driver Qualification Files',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: Vehicles,
        meta: {
          title: 'Fleet Maintenance Registry',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'docs',
        name: 'docs',
        component: DocumentRegistry,
        meta: {
          title: 'Document Registry',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports,
        meta: {
          title: 'Management & Audit Reports',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'specs',
        name: 'specs',
        component: SystemSpecs,
        meta: {
          title: ' System Specs',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        meta: {
          title: 'System Settings',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
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
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
