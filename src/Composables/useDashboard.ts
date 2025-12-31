import { ref, onUnmounted } from 'vue'
import { dataService } from '@/services/dataService'
import type { DashboardStats } from '@/types'

export function useDashboard() {
  const stats = ref<DashboardStats | null>(null)
  const isLoading = ref(false)
  const error = ref<unknown | null>(null)
  let pollingInterval: number | null = null

  const fetchDashboardStats = async (silent = false) => {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await dataService.getDashboardStats()
      stats.value = data
    } catch (err) {
      error.value = err
      console.error('Failed to load dashboard stats', err)
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // Polling logic: Refresh every 30 seconds
  const startPolling = () => {
    stopPolling() // Clean up existing
    pollingInterval = window.setInterval(() => {
      // Only fetch if the tab is visible to save resources
      if (document.visibilityState === 'visible') {
        fetchDashboardStats(true) // silent update
      }
    }, 30000)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  // Initial fetch and start polling
  fetchDashboardStats()
  startPolling()

  // Clean up when the component using the composable is unmounted
  onUnmounted(() => {
    stopPolling()
  })

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
  }
}
