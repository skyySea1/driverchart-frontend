// src/services/dataService.ts
import dayjs from 'dayjs'
import { apiClient } from './apiService'
import type {
  Driver,
  Vehicle,
  Alert,
  DocumentLog,
  AuditLog,
  Applications,
  DriverApplicationForm,
  DashboardStats,
  UploadTokenContext,
  Memo,
} from '@/types'
import { getApp } from 'firebase/app'
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from './firebaseService'
import { COLLECTION_PATHS } from '@/utils/constants'
import { parseDriverDoc } from '@/utils/firestoreParsers'
import { flattenObject } from '@/utils/utils'

// migrate for entity based service and document handling
export const dataService = {

  getDrivers: async (): Promise<
    (Driver & {
      contact: string
      licenseExp?: string
      medicalExp?: string
      mvrDate?: string
      clearinghouseDate?: string
    })[]
  > => {
    // Fallback to API if needed, or implement Firestore fetch here too
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_PATHS.drivers))
      return snapshot.docs.map((doc) => {
        const d = parseDriverDoc({ id: doc.id, ...doc.data() })
        return {
          ...d,
          contact: d.phone,
          licenseNumber: d.license?.documentNumber,
          licenseExp: d.license?.expiryDate,
          medicalExp: d.medical?.expiryDate,
          mvrDate: d.mvr?.expiryDate,
          clearinghouseDate: d.drugAlcohol?.expiryDate,
        }
      })
    } catch (error) {
      console.warn('Failed to fetch drivers from Firestore, falling back to API', error)
      const response = await apiClient.get<Driver[]>('/drivers')
      return response.data.map((d) => ({
        ...d,
        hireStatus: d.hireStatus || 'unknown',
        contact: d.phone,
        licenseNumber: d.license?.documentNumber,
        licenseExp: d.license?.expiryDate,
        medicalExp: d.medical?.expiryDate,
        mvrDate: d.mvr?.expiryDate,
        clearinghouseDate: d.drugAlcohol?.expiryDate,
      }))
    }
  },

  getDriverById: async (id: string): Promise<Driver | null> => {
    try {
      const docRef = doc(db, COLLECTION_PATHS.drivers, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return parseDriverDoc({ id: docSnap.id, ...docSnap.data() })
      }
      return null
    } catch (error) {
      console.warn(`Failed to fetch driver with id ${id} from Firestore`, error)
      // Fallback to API?
      try {
        const response = await apiClient.get<Driver>(`/drivers/${id}`)
        return response.data
      } catch {
        return null
      }
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

  updateDriverPartial: async (id: string, data: Partial<Driver>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_PATHS.drivers, id)
      const { updateDoc } = await import('firebase/firestore')
      // Flatten the data to use dot-notation keys for nested updates in Firestore
      // This prevents overwriting entire nested maps (e.g. 'license') when only one field changes.
      const flattenedData = flattenObject(data)
      await updateDoc(docRef, flattenedData)
    } catch (error) {
      console.warn('Failed to partial update driver via Firestore, falling back to API', error)
      await apiClient.patch(`/drivers/${id}`, data)
    }
  },

  deleteDriver: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_PATHS.drivers, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.warn('Failed to delete driver via Firestore, falling back to API', error)
      await apiClient.delete(`/drivers/${id}`)
    }
  },

  // review ahtat kinda of file is sended
  uploadDocument: async (
    id: string | null, // APPLICANT DOESNT HAVE ID, JUST DRIVER PROMOTION
    type: string,
    file: File,
    uploadDate: string,
    entityName: string,
    expiryDate?: string,
    applicantName?: string,
  ): Promise<{ url: string; filename: string }> => {
    const data = new FormData()
    // Logic to distinguish driver vs applicant ID
    if (id) {
      // Heuristic: If applicantName is provided, assume ID is applicationId
      if (applicantName) {
        data.append('applicationId', id)
      } else {
        data.append('driverId', id)
      }
    }

    if (applicantName) data.append('applicantName', applicantName)

    data.append('entityName', entityName)
    data.append('uploadDate', uploadDate)
    data.append('file', file)
    data.append('documentType', type)

    if (expiryDate) {
      data.append('expiryDate', expiryDate)
    }

    const response = await apiClient.post<{ url: string; filename: string }>(
      '/documents/upload',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
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

  getAuditLogsByEntity: async (entityId: string): Promise<AuditLog[]> => {
    try {
      // Assuming a new endpoint /documents/audit/:id
      const response = await apiClient.get<AuditLog[]>(`/documents/audit/${entityId}`)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch audit logs for entity ${entityId}`, error)
      return []
    }
  },

  addAuditLog: async (log: Omit<AuditLog, 'id'>): Promise<void> => {
    try {
      await apiClient.post('/documents/audit', log)
    } catch (error) {
      console.error('Failed to create audit log', error)
    }
  },

  sendUploadRequest: async (payload: {
    email: string
    driverName: string
    requestType: string
    magicLink: string
    customMessage?: string
    driverId?: string
    docType?: string
  }) => {
    const resp = await apiClient.post('/documents/request-upload', payload)
    return resp.data
  },

  validateUploadToken: async (token: string): Promise<UploadTokenContext> => {
    const resp = await apiClient.get<UploadTokenContext>(`/documents/upload-context/${token}`)
    return resp.data
  },

  uploadWithToken: async (token: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('token', token)

    // We target a new public endpoint that doesn't require session auth, but validates token
    const resp = await apiClient.post('/documents/public-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return resp.data
  },

  sendMemos: async (data: {
    email: string
    driverName: string
    memoTitle: string
    memoLinks: string[]
  }) => {
    return await apiClient.post('/documents/send-memos', data)
  },

  getMemos: async (): Promise<Memo[]> => {
    try {
      const resp = await apiClient.get<Memo[]>('/documents/memos')
      return resp.data
    } catch {
      return []
    }
  },

  uploadMemo: async (file: File, title: string, type: 'memo' | 'policy') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('type', type)
    const resp = await apiClient.post('/documents/memos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return resp.data
  },

  deleteMemo: async (id: string) => {
    await apiClient.delete(`/documents/memos/${id}`)
  },

  // reviewed: get the Firebase Applications Instance ID
  getApplicationInstanceId: async (): Promise<string> => {
    const app = getApp()
    return app.options.appId || 'unknown-app-id'
  },

  // --- Applications ---
  getApplications: async (): Promise<Applications[]> => {
    const response = await apiClient.get<Applications[]>('/applications')
    return response.data
  },

  getApplicationById: async (id: string): Promise<Applications | null> => {
    try {
      const response = await apiClient.get<Applications>(`/applications/${id}`)
      return response.data
    } catch (error) {
      console.warn(`Failed to fetch application with id ${id}`, error)
      return null
    }
  },

  submitApplication: async (application: Omit<DriverApplicationForm, 'id'>): Promise<void> => {
    await apiClient.post('/applications', {
      ...application,
      status: 'New',
      appliedDate: dayjs().format('YYYY-MM-DD'),
    })
  },

  updateApplication: async (application: Applications): Promise<void> => {
    if (!application.id) throw new Error('Application ID missing')
    await apiClient.put(`/applications/${application.id}`, application)
  },
  // todo this method must be used or improved for hiring process too
  updateApplicationStatus: async (
    id: string,
    status: 'Pending' | 'Rejected' | 'Hired',
  ): Promise<void> => {
    await apiClient.put(`/applications/${id}`, { status })
  },

  migrateApplicantToDriver: async (applicationId: string): Promise<string> => {
    const response = await apiClient.post<{ driverId: string }>(
      `/applications/${applicationId}/promote`,
    )
    return response.data.driverId
  },

  // --- Dashboard Stats ---
  getDashboardStats: async (): Promise<DashboardStats> => {
    console.log('[Dashboard] Fetching stats...')
    try {
      const [driversRes, vehiclesRes, alertsRes, applicationsRes] = await Promise.all([
        apiClient.get<Driver[]>('/drivers'),
        apiClient.get<Vehicle[]>('/vehicles'),
        apiClient.get<Alert[]>('/expiration/alerts'),
        apiClient.get<Applications[]>('/applications'),
      ])

      const drivers = driversRes.data
      const vehicles = vehiclesRes.data
      const alerts = alertsRes.data
      const applications = applicationsRes.data

      const newApplicationsCount = applications.filter((a) => a.status === 'New').length

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

      const {
        expiringMedCardsDrivers,
        expiringLicenseDrivers,
        expiringClearinghouseDrivers,
        expiredMvrDrivers,
      } = drivers.reduce<{
        expiringMedCardsDrivers: Driver[]
        expiringLicenseDrivers: Driver[]
        expiringClearinghouseDrivers: Driver[]
        expiredMvrDrivers: Driver[]
      }>(
        (acc, d) => {
          if (isExpiringSoon(d.medical?.expiryDate)) {
            acc.expiringMedCardsDrivers.push(d)
          }
          if (isExpiringSoon(d.license?.expiryDate)) {
            acc.expiringLicenseDrivers.push(d)
          }
          if (isExpiringSoon(d.drugAlcohol?.expiryDate)) {
            acc.expiringClearinghouseDrivers.push(d)
          }
          if (isExpired(d.mvr?.expiryDate)) {
            acc.expiredMvrDrivers.push(d)
          }
          return acc
        },
        {
          expiringMedCardsDrivers: [],
          expiringLicenseDrivers: [],
          expiringClearinghouseDrivers: [],
          expiredMvrDrivers: [],
        },
      )

      const stats = {
        totalDrivers: drivers.length,
        totalVehicles: vehicles.length,
        alertsCount: alerts.length,
        alerts: alerts,
        expiringMedCards: expiringMedCardsDrivers.length,
        expiringLicense: expiringLicenseDrivers.length,
        expiringClearinghouse: expiringClearinghouseDrivers.length,
        auditScore: '94%',
        newApplications: newApplicationsCount,
        annualRecordReview: expiredMvrDrivers.length,
      }
      return stats
    } catch (error) {
      console.error('[Dashboard] Failed to fetch stats', error)
      const fallbackStats: DashboardStats = {
        totalDrivers: 0,
        totalVehicles: 0,
        alertsCount: 0,
        alerts: [],
        expiringMedCards: 0,
        expiringLicense: 0,
        expiringClearinghouse: 0,
        auditScore: '0%',
        newApplications: 0,
        annualRecordReview: 0,
      }
      return fallbackStats
    }
  },

  sendNotifications: async (
    notifications: {
      driverId: string
      driverName: string
      email: string
      documentType: string
      dueDate: string
      daysLeft: number
    }[],
  ): Promise<{ success: boolean; sentCount: number }> => {
    const response = await apiClient.post<{ success: boolean; sentCount: number }>(
      '/expiration/send-notifications',
      { notifications },
    )
    return response.data
  },
}
