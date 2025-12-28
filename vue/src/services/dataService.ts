import dayjs from 'dayjs'
import { mockDrivers } from './mocks/drivers'
import { mockVehicles } from './mocks/vehicles'
import { mockAlerts } from './mocks/alerts'
import { mockDocumentLogs } from './mocks/documentLogs'
import type { Driver, Vehicle, Alert, DocumentLog } from '../types'

// In-memory state initialized from mocks
let driversState: Driver[] = [...mockDrivers]
let vehiclesState: Vehicle[] = [...mockVehicles]
const alertsState: Alert[] = [...mockAlerts]
const logsState: DocumentLog[] = [...mockDocumentLogs]

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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Return flat structure for the view
    return driversState.map((d) => ({
      ...d,
      hireStatus: d.hireStatus || 'Active',
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate,
    }))
  },

  addDriver: async (driver: Driver): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    driver.id = Math.random().toString(36).substr(2, 9)
    driversState.push(driver)
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = driversState.findIndex((d) => d.id === driver.id)
    if (index !== -1) {
      driversState[index] = driver
    }
  },

  deleteDriver: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    driversState = driversState.filter((d) => d.id !== id)
  },

  // --- Vehicles ---
  getVehicles: async (): Promise<Vehicle[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...vehiclesState]
  },

  addVehicle: async (vehicle: Vehicle): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    vehicle.id = Math.random().toString(36).substr(2, 9)
    vehiclesState.push(vehicle)
  },

  updateVehicle: async (vehicle: Vehicle): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = vehiclesState.findIndex((v) => v.id === vehicle.id)
    if (index !== -1) {
      vehiclesState[index] = vehicle
    }
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    vehiclesState = vehiclesState.filter((v) => v.id !== id)
  },

  // --- Alerts & Logs ---
  getAlerts: async (): Promise<Alert[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...alertsState]
  },

  getDocumentLogs: async (): Promise<DocumentLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...logsState]
  },

  // Helper for dashboard
  getDashboardStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const drivers = driversState
    const vehicles = vehiclesState
    const alerts = alertsState

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
      newApplications: 3,
      annualRecordReview: drivers.filter((d) => isExpired(d.mvr?.expiryDate)).length,
    }
  },
}
