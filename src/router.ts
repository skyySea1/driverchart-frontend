// src/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

// Lazy load views
const Login = () => import('@/Views/LoginView.vue')
const AppLayout = () => import('@/Components/templates/AppLayout.vue')
const Dashboard = () => import('@/Views/DashboardView.vue')
const Applications = () => import('@/Views/ApplicationsView.vue')
const PublicApplicationForm = () => import('@/Views/ApplyFormView.vue')
const Drivers = () => import('@/Views/DriversView.vue')
const Vehicles = () => import('@/Views/VehiclesView.vue')
const Settings = () => import('@/Views/SettingsView.vue')
const UserManagement = () => import('@/Views/UserManagementView.vue')
const DriverProfile = () => import('@/Views/DriverProfileView.vue')
const ApplicantProfile = () => import('@/Views/ApplicantProfileView.vue')
const PublicUploadView = () => import('@/Views/PublicUploadView.vue')
const Notfound = () => import('@/Views/NotFound.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false },
  },
{
    path: '/apply',
    name: 'apply',
    component: PublicApplicationForm,
    meta: { requiresAuth: false, title: 'Apply Now' },
  },
  {
    path: '/driver/upload',
    name: 'driver-upload',
    component: PublicUploadView,
    meta: { requiresAuth: false, title: 'Secure Document Upload' },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
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
        path: 'drivers/:id',
        name: 'driver-profile',
        component: DriverProfile,
        meta: {
          title: 'Driver Profile',
          subtitle: 'Driver Data & Compliance logs',
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
        path: 'applications',
        name: 'applications',
        component: Applications,
        meta: {
          title: 'Driver Applications',
          subtitle: 'US DOT #1234567 | FMCSA Passenger Carrier',
        },
      },
      {
        path: 'applications/:id',
        name: 'applicant-profile',
        component: ApplicantProfile,
        meta: {
          title: 'Applicant Profile',
          subtitle: 'Application Details',
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
      {
        path: 'settings/users',
        name: 'user-management',
        component: UserManagement,
        meta: {
          title: 'User Management',
          subtitle: 'Manage System Access & Roles',
          requiresAdmin: true
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Notfound,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isInitializing) {
    await authStore.init()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('[Router] Unauthorized access to', to.path)
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    console.log('[Router] Already authenticated, redirecting to dashboard')
    next('/dashboard')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'Admin') {
    // Redirect to 403 error page using the improved NotFound view logic
    next({ name: 'NotFound', query: { code: 403 } })
  } else {
    next()
  }
})

export default router
