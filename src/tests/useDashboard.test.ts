import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboard } from '@/Composables/useDashboard'
import { dataService } from '@/services/dataService'

// Mock dataService
vi.mock('@/services/dataService', () => ({
  dataService: {
    getDashboardStats: vi.fn(),
  },
}))

import { resetDashboardState } from '@/Composables/useDashboard'

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    resetDashboardState()
  })

  it('should initialize with default values', () => {
    const { statsData, error } = useDashboard()
    // Since fetchDashboardStats is called immediately, isLoading might be true depending on execution order
    // But initially stats and error should be null
    expect(statsData.value).toBeNull()
    expect(error.value).toBeNull()
  })

  it('should fetch stats successfully', async () => {
    const mockStats = {
      totalDrivers: 10,
      totalVehicles: 5,
      alertsCount: 2,
      alerts: [],
      expiringMedCards: 1,
      expiringLicense: 0,
      expiringClearinghouse: 0,
      auditScore: '95%',
      newApplications: 3,
      annualRecordReview: 0,
    }

    // Setup the mock resolution
    vi.mocked(dataService.getDashboardStats).mockResolvedValue(mockStats)

    const { statsData, isLoading, fetchDashboardStats } = useDashboard()

    // Wait for the initial fetch (or call it explicitly if needed for test determinism)
    await fetchDashboardStats()

    expect(isLoading.value).toBe(false)
    expect(statsData.value).toEqual(mockStats)
    expect(dataService.getDashboardStats).toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    const mockError = new Error('Network Error')
    vi.mocked(dataService.getDashboardStats).mockRejectedValue(mockError)

    const { statsData, isLoading, error, fetchDashboardStats } = useDashboard()

    await fetchDashboardStats()

    expect(isLoading.value).toBe(false)
    expect(statsData.value).toBeNull() // Should remain null or previous value
    expect(error.value).toEqual(mockError)
  })
})
