// src/services/dataService.ts
import dayjs from 'dayjs'
import { apiClient } from './apiService'
import type { Driver, Vehicle, Alert, DocumentLog, Application, DashboardStats } from '@/types'
import { getApp } from 'firebase/app'

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

  getDriverById: async (id: string): Promise<Driver | null> => {
    try {
      const response = await apiClient.get<Driver>(`/drivers/${id}`)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch driver with id ${id}`, error)
      return null
    }
  },

  addDriver: async (driver: Omit<Driver, 'id'>): Promise<string> => {
    const response = await apiClient.post<{ id: string }>('/drivers', driver)
    return response.data.id
  },

  updateDriver: async (driver: Driver): Promise<void> => {
    if (!driver.id) {
      throw new Error(
        'Cannot update driver: ID is missing. Please ensure the driver record has been saved first.',
      )
    }
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

  addVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
    const response = await apiClient.post<{ id: string }>('/vehicles', vehicle)
    return response.data.id
  },

  updateVehicle: async (vehicle: Vehicle): Promise<void> => {
    if (!vehicle.id) {
      throw new Error(
        'Cannot update vehicle: ID is missing. Please ensure the vehicle record has been saved first.',
      )
    }
    await apiClient.put(`/vehicles/${vehicle.id}`, vehicle)
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
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

  getDocumentLogsByEntity: async (entityName: string): Promise<DocumentLog[]> => {
    try {
      const response = await apiClient.get<DocumentLog[]>(`/documents/logs/${entityName}`)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch logs for entity ${entityName}`, error)
      return []
    }
  },

  getApplicationInstanceId: async (): Promise<string> => {
    const app = getApp()
    return app.options.appId || 'unknown-app-id'
  },

  // --- Applications ---
  getApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>('/applications')
    return response.data
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    try {
      const response = await apiClient.get<Application>(`/applications/${id}`)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch application with id ${id}`, error)
      return null
    }
  },

  submitApplication: async (
    application: Omit<Application, 'id' | 'status' | 'appliedDate'>,
  ): Promise<void> => {
    await apiClient.post('/applications', {
      ...application,
      status: 'Pending',
      appliedDate: dayjs().format('YYYY-MM-DD'),
    })
  },

  updateApplicationStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
    await apiClient.put(`/applications/${id}`, { status })
  },

  // --- Dashboard Stats ---
  getDashboardStats: async (): Promise<DashboardStats> => {
    console.log('[Dashboard] Fetching stats...')
    try {
      const [driversRes, vehiclesRes, alertsRes, applicationsRes] = await Promise.all([
        apiClient.get<Driver[]>('/drivers'),
        apiClient.get<Vehicle[]>('/vehicles'),
        apiClient.get<Alert[]>('/expiration/alerts'),
        apiClient.get<Application[]>('/applications'),
      ])

      const drivers = driversRes.data
      const vehicles = vehiclesRes.data
      const alerts = alertsRes.data
      const applications = applicationsRes.data

      const pendingApplicationsCount = applications.filter((a) => a.status === 'Pending').length

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

      const stats = {
        totalDrivers: drivers.length,
        totalVehicles: vehicles.length,
        alertsCount: alerts.length,
        alerts: alerts,
        expiringMedCards: drivers.filter((d) => isExpiringSoon(d.medical?.expiryDate)).length,
        expiringLicenses: drivers.filter((d) => isExpiringSoon(d.cdl?.expiryDate)).length,
        expiringClearinghouse: drivers.filter((d) => isExpiringSoon(d.drugAlcohol?.expiryDate))
          .length,
        auditScore: '94%',
        newApplications: pendingApplicationsCount,
        annualRecordReview: drivers.filter((d) => isExpired(d.mvr?.expiryDate)).length,
      }
      return stats
    } catch (error) {
      console.error('[Dashboard] Stats fetch error:', error)
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
