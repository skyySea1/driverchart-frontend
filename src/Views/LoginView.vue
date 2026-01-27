<template>
  <AnimatedBody>
    <!-- Login Card -->
    <div class="logincard rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Header with Logo -->
      <!-- todo componetize logincard -->
      <div class="bg-slate-900 p-12 text-center">
        <div class="flex flex-col items-center gap-6">
          <div class="flex items-center gap-3">
            <Bus class="w-10 h-10 text-blue-400 shrink-0" />
            <h1 class="text-3xl font-bold text-white">CharterSafe</h1>
          </div>
          <p class="text-sm text-indigo-200">DOT Compliance Management System</p>
        </div>
      </div>

      <!-- Login Form -->
      <div class="p-8 bg-white">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">
          Sign In To CharterSafe
        </h2>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span class="text-sm">{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
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
                class="w-full pl-10 pr-4 py-3 border input-base"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
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
                class="w-full pl-10 pr-12 py-3 border border-slate-300 input-base"
                :disabled="isLoading"
              />
              <button
                v-cursor
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
                v-cursor
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                :disabled="isLoading"
              />
              <span class="ml-2 text-slate-600">Remember me</span>
            </label>
          </div>

          <!-- Login Button -->
          <button
            v-cursor
            type="submit"
            :disabled="isLoading"
            class="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>
      </div>
    </div>
    <!-- Copyright -->
    <div class="absolute bottom-4 text-center w-full">
      <p class="text-white text-sm opacity-80">&copy; 2025 CharterSafe. All rights reserved.</p>
    </div>
  </AnimatedBody>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Bus } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/AuthStore'
import AnimatedBody from '@/Components/ui/AnimatedBody.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// UI state mapped to store
const isLoading = ref(false)
const errorMessage = ref('')

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
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = 'Invalid email or password'
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
<style scoped>
/* Login card needs to have a higher z-index */
.logincard {
  position: relative;
  z-index: 10;
}
</style>
