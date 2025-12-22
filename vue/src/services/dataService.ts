import { mockDrivers } from './mocks/drivers'
import { mockVehicles } from './mocks/vehicles'
import { mockAlerts } from './mocks/alerts'
import { mockDocumentLogs } from './mocks/documentLogs'
import type { Driver, Vehicle, Alert, DocumentLog } from '../types'

// In-memory state initialized from mocks
let driversState = [...mockDrivers]
let vehiclesState = [...mockVehicles]
let alertsState = [...mockAlerts]
let logsState = [...mockDocumentLogs]

export const dataService = {
  // --- Drivers ---
  getDrivers: async (): Promise<any[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Return flat structure for the view
    return driversState.map(d => ({
      ...d,
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate
    }))
  },

  addDriver: async (driver: Driver): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    driver.id = Math.random().toString(36).substr(2, 9) // Generate temp ID
    driversState.push(driver)
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = driversState.findIndex(d => d.id === driver.id)
    if (index !== -1) {
      driversState[index] = driver
    }
  },

  deleteDriver: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    driversState = driversState.filter(d => d.id !== id)
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
    const index = vehiclesState.findIndex(v => v.id === vehicle.id)
    if (index !== -1) {
      vehiclesState[index] = vehicle
    }
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    vehiclesState = vehiclesState.filter(v => v.id !== id)
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

    return {
      totalDrivers: drivers.length,
      totalVehicles: vehicles.length,
      alertsCount: alerts.length,
      alerts: alerts,
      expiringMedCards: drivers.filter(d => {
        if (!d.medical?.expiryDate) return false
        const expiry = new Date(d.medical.expiryDate)
        const today = new Date()
        const diff = expiry.getTime() - today.getTime()
        return diff < 30 * 24 * 60 * 60 * 1000 // less than 30 days
      }).length,
      auditScore: '94%',
      newApplications: 3,
      annualRecordReview: drivers.filter(d => {
        if (!d.mvr?.expiryDate) return false
        return new Date(d.mvr.expiryDate) < new Date()
      }).length
    }
  }
}
