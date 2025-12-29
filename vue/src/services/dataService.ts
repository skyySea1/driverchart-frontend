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
      hireStatus: d.hireStatus || 'Active',
      contact: d.phone,
      cdlExp: d.cdl?.expiryDate,
      medicalExp: d.medical?.expiryDate,
      mvrDate: d.mvr?.expiryDate,
      clearinghouseDate: d.drugAlcohol?.expiryDate,
    }))
  },

  addDriver: async (driver: Driver): Promise<string> => {
    const response = await apiClient.post<{ id: string }>('/drivers', driver)
    return response.data.id
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    if (!driver.id) throw new Error('Driver ID is required for update')
    await apiClient.put(`/drivers/${driver.id}`, driver)
  },

  deleteDriver: async (id: string): Promise<void> => {
    await apiClient.delete(`/drivers/${id}`)
  },

  // --- Vehicles ---
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles')
    return response.data
  },

  addVehicle: async (vehicle: Vehicle): Promise<string> => {
    const response = await apiClient.post<{ id: string }>('/vehicles', vehicle)
    return response.data.id
  },

  updateVehicle: async (vehicle: Vehicle): Promise<void> => {
    if (!vehicle.id) throw new Error('Vehicle ID is required for update')
    await apiClient.put(`/vehicles/${vehicle.id}`, vehicle)
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
  },

  // --- Alerts & Logs ---
  getAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get<Alert[]>('/expiration/alerts')
    return response.data
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
