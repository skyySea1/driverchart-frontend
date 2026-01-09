import type { Component } from 'vue/dist/vue.js'
import { z } from 'zod'
import { DriverSchema, ComplianceItemSchema } from '@/shared/schemas/DriverSchema'

export type AlertType = 'error' | 'success' | 'warning' | 'info'
export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  entity?: string
  entityName?: string
  dueDate: string
}

export type HireStatusType = 'Active' | 'Terminated'
export type ComplianceItem = z.infer<typeof ComplianceItemSchema>

export interface DocumentLog {
  id: string
  date: string
  fileName: string
  type: string
  entityName: string
  user: string
}

export interface FirestoreDoc {
  id: string
  [key: string]: unknown
}

// Inferred Driver Type + Firestore ID + UI-only fields
type DriverBase = z.infer<typeof DriverSchema>
export interface Driver extends Omit<DriverBase, 'id'>, FirestoreDoc {
  ssnDocFile?: File | null
  ssnDocPreviewUrl?: string
}

export interface DriverRow extends Driver {
  firstName: string
  middleName: string
  lastName: string
  contact: string
  // Flat fields for Table Display (Added by DataService)
  cdlNumber?: string
  cdlExp: string
  medicalExp: string
  mvrDate: string
  clearinghouseDate: string
  actions?: string
}
// implementn more fields #task10
export interface Application extends FirestoreDoc {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'Pending' | 'Approved' | 'Rejected'
  appliedDate: string
  experienceYears?: number
  cdlNumber?: string
  notes?: string
}

// DriverForm is now just the Driver structure (plus UI fields if needed)
// We are normalizing to use the nested structure in forms too.
export type DriverForm = Driver

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'purple'
  | 'green'

export interface Column<T = unknown> {
  key: keyof T | string
  label: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface Vehicle extends FirestoreDoc {
  busNumber: string
  vin: string
  vehicleStatus: 'Active' | 'Maintenance' | 'Inactive'
  lastAnnualInspection: string // YYYY-MM-DD
  mileage: number
  inspectionFile?: string
}

export interface DashboardStats {
  totalDrivers: number
  totalVehicles: number
  alertsCount: number
  alerts: Alert[]
  expiringMedCards: number
  expiringLicenses: number
  expiringClearinghouse: number
  auditScore: string
  newApplications: number
  annualRecordReview: number
}

// CardType expansion to support multiple views
export type CardType =
  | 'inspections'
  | 'licenses'
  | 'clearinghouse'
  | 'drivers'
  | 'medical'
  | 'alerts'
  | 'audit'
  | 'applications'
  | 'reviews'
  | 'fleet'
  | 'active_fleet'

export interface StatConfig {
  icon: Component
  bgClass: string
  iconClass: string
  badgeText: string | null
  badgeVariant: BadgeVariant
}

export type ViewState =
  | 'dashboard'
  | 'drivers'
  | 'vehicles'
  | 'auditreports '
  | 'documentregistry'
  | 'applications'
  | 'login'
  | 'settings'

export type I9FormData = Partial<Driver> & {
  w9Address?: string
  w9CityStateZip?: string
  dob?: string
  ssn?: string
  phone?: string
  i9DocTitle?: string
  i9IssuingAuth?: string
  i9DocNumber?: string
  i9DocExp?: string
  i9EmployerSignature?: string
  i9Date?: string
  i9EmployerTitle?: string
}
