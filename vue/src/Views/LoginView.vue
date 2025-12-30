<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- SVG pulsing Background  -->
    <svg
      class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none animate-pulse-slow"
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

    <!-- Central pulsing circle with glassmorphism effect (LARGER and BEHIND) -->
    <div class="circle-container">
      <div class="circle-glow animate-pulse-glow">
        <div class="circle-inner"></div>
      </div>
    </div>

    <!-- Login Card -->
    <div class="logincard bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Header with Logo -->
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
      <div class="p-8">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">
          Sign In To CharterSafe
        </h2>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="loginerror bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span class="text-sm">{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="loginform space-y-5">
          <!-- Email Field -->
          <div class="loginfield">
            <label for="email" class="loginlabel block text-sm font-medium text-slate-700 mb-2">
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
                class="logininput w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="loginlabel block text-sm font-medium text-slate-700 mb-2">
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
                class="logininput w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
            class="loginsubmit w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Bus } from 'lucide-vue-next'

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
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // save to localStorage and redirect
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/dashboard')
  } catch (error) {
    const err = error as Error
    errorMessage.value = err.message || 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>
<style scoped>
/* Background Circle Animation */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Circle Container  */
.circle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

/* Login card needs to have a higher z-index */
.logincard {
  position: relative;
  z-index: 10;
}

/* Central circle with glow effect - LARGER  */
.circle-glow {
  width: 600px; /* 20% larger than the main circle */
  height: 600px;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.25),
    rgba(59, 130, 246, 0.08),
    transparent
  );
  box-shadow:
    0 0 80px rgba(99, 102, 241, 0.3),
    0 0 160px rgba(59, 130, 246, 0.25),
    inset 0 0 80px rgba(99, 102, 241, 0.15);
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px; /* 20% larger proportionally */
  height: 450px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.2));
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/*  Pulse Glow Animation */
@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
    filter: blur(3px);
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
    filter: blur(0px);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}
</style>
