import { describe, it, expect, vi } from 'vitest'
import { dataService } from '@/services/dataService'
import dayjs from 'dayjs'

// Mock apiClient
const mockGet = vi.fn()
vi.mock('@/services/apiService', () => ({
  apiClient: {
    get: (url: string) => mockGet(url),
  },
}))

describe('dataService Logic', () => {
  it('correctly calculates dashboard stats from API responses', async () => {
    // Setup Mock Data
    const today = dayjs()
    const expiringDate = today.add(15, 'day').toISOString() // Expiring soon
    const expiredDate = today.subtract(10, 'day').toISOString() // Expired
    const validDate = today.add(60, 'day').toISOString() // Valid

    // Mock API Responses
    mockGet.mockImplementation((url: string) => {
      if (url === '/drivers') {
        return Promise.resolve({
          data: [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Expiring',
              license: { expiryDate: expiringDate }, // +1 Expiring license
              medical: { expiryDate: validDate },
              drugAlcohol: { expiryDate: validDate },
              mvr: { expiryDate: validDate },
            },
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Expired',
              license: { expiryDate: validDate },
              medical: { expiryDate: expiredDate }, // Is Expired, NOT Expiring Soon (since isExpiringSoon checks diff >= 0)
              drugAlcohol: { expiryDate: validDate },
              mvr: { expiryDate: expiredDate }, // +1 Annual Record Review (Expired MVR)
            },
          ],
        })
      }
      if (url === '/vehicles') return Promise.resolve({ data: [{}, {}] }) // 2 Vehicles
      if (url === '/expiration/alerts') return Promise.resolve({ data: [{ id: 'a1' }] }) // 1 Alert
      if (url === '/applications')
        return Promise.resolve({ data: [{ status: 'Pending' }, { status: 'Approved' }] }) // 1 Pending
      return Promise.reject(new Error('Unknown URL'))
    })

    const stats = await dataService.getDashboardStats()

    // Verify Calls
    expect(mockGet).toHaveBeenCalledWith('/drivers')
    expect(mockGet).toHaveBeenCalledWith('/vehicles')

    // Verify Calculations
    expect(stats.totalDrivers).toBe(2)
    expect(stats.totalVehicles).toBe(2)
    expect(stats.alertsCount).toBe(1)
    expect(stats.newApplications).toBe(1) // 1 Pending

    // Logic Checks
    expect(stats.expiringLicense).toBe(1) // John's license
    expect(stats.annualRecordReview).toBe(1) // Jane's MVR
  })
})
