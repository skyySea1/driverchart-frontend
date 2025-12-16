// src/composables/useAuth.ts
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '../services/firebase'

const currentUser = ref<User | null>(null)
// prevent show login while checking auth state on app start
const isLoading = ref(false)
const isInitializing = ref(true)
const error = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)

  async function login(email: string, password: string) {
    error.value = null
    isLoading.value = true
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      currentUser.value = credential.user
      return credential.user
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      currentUser.value = null
      // Clean localStorage
      localStorage.removeItem('isAuthenticated')
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }
  const loading = computed(() => isLoading.value || isInitializing.value)
  
  // verify auth state on app start
  function initAuth() {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user
        isInitializing.value = false
        resolve()
      })
    })
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
}
