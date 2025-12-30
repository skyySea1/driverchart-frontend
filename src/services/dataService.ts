import dayjs from 'dayjs'
import { apiClient } from './api'
import type { Driver, Vehicle, Alert, DocumentLog } from '@/types'

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
    const response = await apiClient.get<Driver[]>('/drivers')
    return response.data.map((d) => ({
      ...d,
      hireStatus: d.hireStatus || 'unknown',
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate,
    }))
  },

  addDriver: async (driver: Driver): Promise<string> => {
    const response = await apiClient.post<{ driverId: string }>('/drivers', driver)
    return response.data.driverId
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    if (!driver.driverId) {
      throw new Error(
        'Cannot update driver: ID is missing. Please ensure the driver record has been saved first.'
      )
    }
    await apiClient.put(`/drivers/${driver.driverId}`, driver)
  },

  deleteDriver: async (driverId: string): Promise<void> => {
    await apiClient.delete(`/drivers/${driverId}`)
  },

  // --- Vehicles ---
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles')
    return response.data
  },

  addVehicle: async (vehicle: Vehicle): Promise<string> => {
    const response = await apiClient.post<{ vehicleId: string }>('/vehicles', vehicle)
    return response.data.vehicleId
  },

  updateVehicle: async (vehicle: Vehicle): Promise<void> => {
    if (!vehicle.vehicleId) {
      throw new Error(
        'Cannot update vehicle: ID is missing. Please ensure the vehicle record has been saved first.'
      )
    }
    await apiClient.put(`/vehicles/${vehicle.vehicleId}`, vehicle)
  },

  deleteVehicle: async (vehicleId: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${vehicleId}`)
  },

  // --- Alerts & Logs ---
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await apiClient.get<Alert[]>('/expiration/alerts')
      return response.data
    } catch (error) {
      console.warn('Failed to fetch alerts', error)
      return []
    }
  },

  getDocumentLogs: async (): Promise<DocumentLog[]> => {
    try {
      const response = await apiClient.get<DocumentLog[]>('/documents/logs')
      return response.data
    } catch (error) {
      console.warn('Failed to fetch logs', error)
      return []
    }
  },
// todo divide services into domain-view-specific files, like dashboardService.ts
  // Helper for dashboard
  getDashboardStats: async () => {
    try {
      const [driversRes, vehiclesRes, alertsRes] = await Promise.all([
        apiClient.get<Driver[]>('/drivers'),
        apiClient.get<Vehicle[]>('/vehicles'),
        apiClient.get<Alert[]>('/expiration/alerts'),
      ])

      const drivers = driversRes.data
      const vehicles = vehiclesRes.data
      const alerts = alertsRes.data

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
    } catch (error) {
      console.error('Dashboard stats error:', error)
      return {
        totalDrivers: 0,
        totalVehicles: 0,
        alertsCount: 0,
        alerts: [],
        expiringMedCards: 0,
        expiringLicenses: 0,
        expiringClearinghouse: 0,
        auditScore: '0%',
        newApplications: 0,
        annualRecordReview: 0,
      }
    }
  },
}
