import dayjs from 'dayjs'
import { mockDrivers } from './mocks/drivers'
import { mockVehicles } from './mocks/vehicles'
import { mockAlerts } from './mocks/alerts'
import { mockDocumentLogs } from './mocks/documentLogs'
import { mockApplications } from './mocks/applications'
import type { Driver, Vehicle, Alert, DocumentLog, Application } from '../types'

// In-memory state initialized from mocks
let driversState = [...mockDrivers]
let vehiclesState = [...mockVehicles]
let applicationsState = [...mockApplications]
const alertsState = [...mockAlerts]
const logsState = [...mockDocumentLogs]

export const dataService = {
  // --- Drivers ---
  getDrivers: async (): Promise<
    (Driver & {
      contact: string
      cdlExp?: string
      medicalExp?: string
      mvrDate?: string
      clearinghouseDate?: string
    })[]
  > => {
    // Return flat structure for the view
    return driversState.map((d) => ({
      ...d,
      hireStatus: d.hireStatus || 'Active', // Ensure hireStatus is present
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate,
    }))
  },

  addDriver: async (driver: Driver): Promise<void> => {
    // todo use more robust uuid generation
    driver.id = Math.random().toString(36).substr(2, 9) // Generate temp ID
    driversState.push(driver)
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    const index = driversState.findIndex((d) => d.id === driver.id)
    if (index !== -1) {
      driversState[index] = driver
    }
  },

  deleteDriver: async (id: string): Promise<void> => {
    driversState = driversState.filter((d) => d.id !== id)
  },

  // --- Vehicles ---
  getVehicles: async (): Promise<Vehicle[]> => {
    return [...vehiclesState]
  },

  addVehicle: async (vehicle: Vehicle): Promise<void> => {
    vehicle.id = Math.random().toString(36).substr(2, 9)
    vehiclesState.push(vehicle)
  },

  updateVehicle: async (vehicle: Vehicle): Promise<void> => {
    const index = vehiclesState.findIndex((v) => v.id === vehicle.id)
    if (index !== -1) {
      vehiclesState[index] = vehicle
    }
  },

  deleteVehicle: async (id: string): Promise<void> => {
    vehiclesState = vehiclesState.filter((v) => v.id !== id)
  },

  // --- Applications ---
  getApplications: async (): Promise<Application[]> => {
    return [...applicationsState]
  },

  submitApplication: async (
    application: Omit<Application, 'id' | 'status' | 'appliedDate'>,
  ): Promise<void> => {
    const newApp: Application = {
      ...application,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      appliedDate: dayjs().format('YYYY-MM-DD'),
    }
    applicationsState.push(newApp)
  },

  updateApplicationStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
    const index = applicationsState.findIndex((a) => a.id === id)
    if (index !== -1) {
      applicationsState[index].status = status
    }
  },

  // --- Alerts & Logs ---
  getAlerts: async (): Promise<Alert[]> => {
    return [...alertsState]
  },

  getDocumentLogs: async (): Promise<DocumentLog[]> => {
    return [...logsState]
  },

  // Helper for dashboard
  getDashboardStats: async () => {
    const drivers = driversState
    const vehicles = vehiclesState
    const alerts = alertsState
    const pendingApps = applicationsState.filter((a) => a.status === 'Pending').length

    const today = dayjs().startOf('day')

    const isExpiringSoon = (dateStr?: string) => {
      if (!dateStr) return false
      const diff = dayjs(dateStr).diff(today, 'day')
      return diff >= 0 && diff <= 30
    }

    const isExpired = (dateStr?: string) => {
      if (!dateStr) return false
      return dayjs(dateStr).isBefore(today, 'day')
    }

    return {
      totalDrivers: drivers.length,
      totalVehicles: vehicles.length,
      alertsCount: alerts.length,
      alerts: alerts,
      expiringMedCards: drivers.filter((d) => isExpiringSoon(d.medical?.expiryDate)).length,
      expiringLicenses: drivers.filter((d) => isExpiringSoon(d.cdl?.expiryDate)).length,
      expiringClearinghouse: drivers.filter((d) => isExpiringSoon(d.drugAlcohol?.expiryDate))
        .length,
      auditScore: '94%',
      newApplications: pendingApps,
      annualRecordReview: drivers.filter((d) => isExpired(d.mvr?.expiryDate)).length,
    }
  },
}
