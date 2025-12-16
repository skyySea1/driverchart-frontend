<template>
  <div class="  login min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
<!-- SVG Background -->
  <svg
    class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
    </defs>
    <circle cx="50%" cy="50%" r="500" fill="url(#grad)" />
  </svg>

    <!-- Login Card -->
    <div class=" login__card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

      <!-- Header with Logo -->
      <div class="bg-slate-900 p-12 text-center">
  <div class="flex flex-col items-center gap-6">
    <div class="flex items-center gap-3">
      <Truck class="w-10 h-10 text-blue-400 shrink-0" />
      <h1 class="text-3xl font-bold text-white">
        CharterSafe
      </h1>
    </div>

    <p class="text-sm text-indigo-200">
      DOT Compliance Management System
    </p>
  </div>
</div>


      <!-- Login Form -->
      <div class="p-8">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">Sign In To CharterSafe</h2>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="login__error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span class="text-sm">{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="login__form space-y-5">
          <!-- Email Field -->
          <div class="login__field">
            <label for="email" class="login__label block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
                class="login__input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div >
            <label for="password" class="login__label block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="login__input w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                :disabled="isLoading"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                :disabled="isLoading"
              />
              <span class="ml-2 text-slate-600">Remember me</span>
            </label>
            <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </a>
          </div>

          <!-- Login Button -->
          <button
          v-cursor
            type="submit"
            :disabled="isLoading"
            class="login__submit w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>



      </div>
    </div>
    <!-- Copyright -->
    <div class="absolute bottom-4 text-center w-full">
      <p class="text-white text-sm opacity-80">&copy; 2025 PhoenixBus. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Logo from '@/Components/ui/logo.vue'
import { useRouter } from 'vue-router'
import { Bus, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Truck } from 'lucide-vue-next'
import type logoVue from '@/Components/ui/logo.vue'

const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// UI state
const isLoading = ref(false)
const errorMessage = ref('')

// Mock login handler (replace with Firebase Auth)
async function handleLogin() {
  // Clear previous errors
  errorMessage.value = ''

  // Validate
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  try {
    isLoading.value = true

    // TODO: Replace with Firebase Authentication
    // await signInWithEmailAndPassword(auth, email.value, password.value)

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock success - save to localStorage and redirect
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/dashboard')

  } catch (error: any) {
    errorMessage.value = error.message || 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>
