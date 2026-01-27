import { ref, onUnmounted } from 'vue'
import { dataService } from '@/services/dataService'
import type { DashboardStats } from '@/types'

// Singleton State
const statsData = ref<DashboardStats | null>(null)
const isLoading = ref(false)
const error = ref<unknown | null>(null)
let pollingInterval: number | null = null
let listeners = 0

export function useDashboard() {
  const fetchDashboardStats = async (silent = false) => {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await dataService.getDashboardStats()
      statsData.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to load dashboard stats Data', err)
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // Polling logic: Refresh every 30 seconds
  const startPolling = () => {
    if (pollingInterval) return // Already polling

    pollingInterval = window.setInterval(() => {
      // Only fetch if the tab is visible to save resources
      if (document.visibilityState === 'visible') {
        fetchDashboardStats(true) // silent update
      }
    }, 30000)
  }

  const stopPolling = () => {
    if (listeners <= 0 && pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  // Init logic
  listeners++
  if (!statsData.value && !isLoading.value) {
    fetchDashboardStats()
  }
  startPolling()

  // Clean up when the component using the composable is unmounted
  onUnmounted(() => {
    listeners--
    stopPolling()
  })

  return {
    statsData,
    isLoading,
    error,
    fetchDashboardStats,
  }
}

export function resetDashboardState() {
  statsData.value = null
  isLoading.value = false
  error.value = null
  pollingInterval = null
  listeners = 0
}
