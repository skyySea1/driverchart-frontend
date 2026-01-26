import { describe, it, expect, vi } from 'vitest'
import { dataService } from '@/services/dataService'
import dayjs from 'dayjs'

vi.mock('@/services/firebaseService', () => ({
  db: {},
  auth: {},
}))

// Mock Firebase to force API fallback (still needed for imports in dataService)
vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(),
  getDocs: vi.fn().mockRejectedValue(new Error('Firestore disabled in test')), // Force fallback
  collection: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  getFirestore: vi.fn(),
}))

vi.mock('firebase/app', () => ({
  getApp: vi.fn(() => ({ options: { appId: 'test' } })),
  initializeApp: vi.fn(),
}))

// Mock apiClient
const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()

vi.mock('@/services/apiService', () => ({
  apiClient: {
    get: (url: string) => mockGet(url),
    post: (url: string, data: any) => mockPost(url, data),
    put: (url: string, data: any) => mockPut(url, data),
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
        return Promise.resolve({ data: [{ status: 'Pending' }, { status: 'Hired' }] }) // 1 Pending
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

  it('migrateApplicantToDriver correctly maps data and calls APIs', async () => {
    // Setup Mock Data
    const appId = 'app123'
    const application = {
      id: appId,
      status: 'New',
      personalInfo: {
        firstName: 'New',
        lastName: 'Driver',
        email: 'new@driver.com',
        phone: '555-0000',
        ssnNumber: '123-00-1234',
        middleName: '',
        dob: '1990-01-01',
        medicalExpirationDate: '2025-01-01',
      },
      addresses: [
        { street: '123 Main St', city: 'Orlando', state: 'FL', zip: '32801' }
      ],
      licenses: [
        { number: 'L123', state: 'FL', expirationDate: '2026-01-01' }
      ]
    }

    // Mock Responses
    mockGet.mockImplementation((url) => {
      if (url === `/applications/${appId}`) return Promise.resolve({ data: application })
      if (url === '/drivers') return Promise.resolve({ data: [] }) // No duplicates
      return Promise.reject(new Error('Unknown URL'))
    })

    mockPost.mockResolvedValue({ data: { id: 'driver123' } }) // Address addDriver
    mockPut.mockResolvedValue({}) // Address updateApplication

    await dataService.migrateApplicantToDriver(appId)

    // Verify Driver Creation
    expect(mockPost).toHaveBeenCalledWith('/drivers', expect.objectContaining({
      firstName: 'New',
      lastName: 'Driver',
      hireStatus: 'Pending', // Creating as Pending
      email: 'new@driver.com',
      license: expect.objectContaining({
        documentNumber: 'L123',
        state: 'FL'
      })
    }))

    // Verify Application Status Update
    expect(mockPut).toHaveBeenCalledWith(`/applications/${appId}`, { status: 'Pending' })
  })

  it('migrateApplicantToDriver throws error on duplicate', async () => {
     // Setup Mock Data
    const appId = 'app123'
    const application = {
      id: appId,
      personalInfo: { email: 'duplicate@driver.com', ssnNumber: '111', firstName: 'Dup', lastName: 'Licate' },
      addresses: [], licenses: []
    }

    // Mock Responses
    mockGet.mockImplementation((url) => {
      if (url === `/applications/${appId}`) return Promise.resolve({ data: application })
      if (url === '/drivers') return Promise.resolve({ data: [{ email: 'duplicate@driver.com' }] }) // Duplicate exist
      return Promise.reject(new Error('Unknown URL'))
    })

    await expect(dataService.migrateApplicantToDriver(appId)).rejects.toThrow('already exists')
  })
