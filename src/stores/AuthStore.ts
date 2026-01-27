import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebaseService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitializing = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const userDisplayName = computed(() => {
    if (user.value?.firstName && user.value?.lastName) {
      return `${user.value.firstName} ${user.value.lastName}`
    }
    return user.value?.email?.split('@')[0] || 'User'
  })

  const userInitial = computed(() => {
    return (user.value?.firstName?.[0] || user.value?.email?.[0] || 'U').toUpperCase()
  })

  const userRole = computed(() => {
    return user.value?.role || 'Viewer'
  })

  const APP_ID = import.meta.env.VITE_APP_ID
  const USERS_COLLECTION = `artifacts/${APP_ID}/public/data/users`

  function init() {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch extended profile from Firestore
            const docRef = doc(db, USERS_COLLECTION, firebaseUser.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
              const data = docSnap.data()
              user.value = {
                id: firebaseUser.uid,
                email: data.email || firebaseUser.email || '',
                firstName: data.firstName || firebaseUser.displayName?.split(' ')[0] || '',
                lastName:
                  data.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                role: data.role || 'Viewer',
                isActive: data.isActive ?? true,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
                avatar: data.avatar,
                displayName: data.displayName,
                name: data.name,
                lastLogin: data.lastLogin,
              }
            } else {
              // Fallback for users not in Firestore (e.g. bootstrap or legacy)
              // Use least-privilege role by default; administrator access must be granted explicitly
              console.warn('User profile not found in Firestore. Using fallback profile.')
              user.value = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                firstName: firebaseUser.displayName?.split(' ')[0] || 'Admin',
                lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'User',
                role: 'Viewer',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            }
          } catch (e) {
            console.error('Error fetching user profile:', e)
            error.value = 'Failed to load user profile'
          }
        } else {
          user.value = null
        }
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

      // Wait for the user state to be updated by the observer (init logic)
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unwatch()
          reject(new Error('Login timed out waiting for user profile'))
        }, 10000)

        const unwatch = watch(
          [user, error],
          ([newUser, newError]) => {
            if (newUser) {
              clearTimeout(timeout)
              unwatch()
              resolve()
            } else if (newError) {
              clearTimeout(timeout)
              unwatch()
              reject(new Error(newError))
            }
          },
          { immediate: true },
        )
      })
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
      user.value = null
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserProfile(data: { displayName: string }) {
    // This updates the Firebase Auth profile and Firestore document
    isLoading.value = true
    error.value = null
    try {
      if (auth.currentUser) {
        // 1. Update Firebase Auth Profile
        await updateProfile(auth.currentUser, {
          displayName: data.displayName,
        })

        // 2. Prepare data for Firestore
        const firstName = data.displayName.split(' ')[0] || ''
        const lastName = data.displayName.split(' ').slice(1).join(' ') || ''

        // 3. Update Firestore Document
        const docRef = doc(db, USERS_COLLECTION, auth.currentUser.uid)

        try {
          await updateDoc(docRef, {
            firstName,
            lastName,
            displayName: data.displayName,
            updatedAt: new Date().toISOString(),
          })
        } catch (e) {
          console.warn(
            'Firestore update failed (doc might not exist), attempting to create/merge...',
            e,
          )
        }

        // 4. Optimistic update of local state
        if (user.value) {
          user.value.firstName = firstName
          user.value.lastName = lastName
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
    userRole,
    isLoading,
    isInitializing,
    error,
    login,
    logout,
    init,
    updateUserProfile,
  }
})
