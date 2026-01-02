import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, type User } from 'firebase/auth'
import { auth } from '@/services/firebaseService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitializing = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const userDisplayName = computed(() => {
    if (user.value?.displayName) {
      return user.value.displayName
    }
    const email = user.value?.email
    if (email) {
      const namePart = email.split('@')[0]
      if (namePart) {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1)
      }
    }
    return 'User'
  })

  const userInitial = computed(() => {
    return userDisplayName.value.charAt(0).toUpperCase()
  })

  function init() {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        isInitializing.value = false
        resolve()
      })
    })
  }

  async function login(email: string, password: string) {
    error.value = null
    isLoading.value = true
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Navigation is handled by the component or router guard
      // but store state update is handled by onAuthStateChanged automatically
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred during login'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await signOut(auth)
      // router.push('/login') // Can be handled here or in component
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserProfile(data: { displayName: string }) {
    isLoading.value = true
    error.value = null
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName,
        })
        // Force refresh local user state
        // creating a shallow copy to trigger reactivity if needed,
        // though auth state listener might catch it too, explicit update is safer for UI feedback
        if (user.value) {
          user.value = { ...user.value, displayName: data.displayName }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    userDisplayName,
    userInitial,
    isLoading,
    isInitializing,
    error,
    login,
    logout,
    init,
    updateUserProfile,
  }
})
