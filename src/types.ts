import type { Component } from 'vue/dist/vue.js'
import { z } from 'zod'
import { DriverSchema, ComplianceItemSchema } from '@/shared/schemas/DriverSchema'

export type AlertType = 'error' | 'success' | 'warning' | 'info'
export type HireStatusType = 'Active' | 'Terminated'
export type ApplicationStatusType = 'Pending' | 'Approved' | 'Rejected'
export type ComplianceItem = z.infer<typeof ComplianceItemSchema>
export type DriverBase = z.infer<typeof DriverSchema> // Inferred Driver Type + Firestore ID + UI-only fields

// entity can be used for searching by name or type
export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  entity?: string
  entityId?: string
  entityName?: string
  dueDate: string
}

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

export type DriverForm = Driver

export type SortOrder = 'asc' | 'desc' | null

export type comparedValues = string | number | null | undefined
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
  expiringCDL: number
  expiringClearinghouse: number
  auditScore: string
  newApplications: number
  annualRecordReview: number
}

// CardType expansion to support multiple views
export type CardType =
  | 'inspections'
  | 'CDL'
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
  | 'auditreports'
  | 'documentregistry'
  | 'applications'
  | 'login'
  | 'settings'

export type USState =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY'
  | 'DC'
  | ''

// User Role Types
export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'auditor' | 'viewer'
export type VehicleTypes =
  | 'Passenger Bus'
  | 'School Bus'
  | 'Charter Bus'
  | 'Straight Truck'
  | 'Semi-Truck/Trailer'
  | 'Van/Doubles'
  | 'Tractor'
  | ''

// Login Status Types
export type LoginStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'failed'
  | 'unauthorized'
  | 'session_expired'
  | 'mfa_required'
  | 'mfa_pending'

// User Interface with Login Info
export interface User extends FirestoreDoc {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
  avatar?: string
}

// Login Request/Response Types
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loginStatus: LoginStatus
  error?: string
}

export type I9FormData = Partial<Driver> & {
  w9Address?: string
  w9CityStateZip?: string
  dob?: string
  ssnNumber?: string
  phone?: string
  i9DocTitle?: string
  i9IssuingAuth?: string
  i9DocNumber?: string
  i9DocExp?: string
  i9EmployerSignature?: string
  i9Date?: string
  i9EmployerTitle?: string
}

// Application Form Data Type

export interface Address {
  street: string
  city: string
  state: USState
  zip: string
  fromDate: string
  toDate?: string
  present?: boolean
}

// Personal Info
export interface PersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  dob: string
  email: string
  phone: string
  ssnNumber: string
  medicalExpirationDate?: string
}
export interface License {
  number: string
  state: USState
  class: string
  endorsements: string
  restrictions: string
  emissionDate: string
  expirationDate: string
}
export interface Accident {
  date: string
  location: string
  description: string
  injuries: boolean
  fatalities: boolean
}
export interface Violation {
  date: string
  violation: string
  location: string
  penalty: string
}
export interface Employment {
  companyName: string
  address: string
  city: string
  state: USState
  zip: string
  phone: string
  position: string
  description?: string
  fromDate: string
  toDate: string
  reasonForLeaving: string
  cdlNumber?: string
  wasCDL: boolean
  present?: boolean
}

export interface VehicleExperience {
  type: VehicleTypes
  totalMileage: string | number
}

// Table view - simplified application data
export interface Applications extends FirestoreDoc {
  personalInfo: {
    firstName: string
    lastName: string
    middleName?: string
    email: string
    phone: string
    dob: string
    ssnNumber: string
  }
  status: ApplicationStatusType
  appliedDate: string
  addresses: Address[]
  licenses: License[]
  vehicleExperience: VehicleExperience[]
  notes?: string
}

export interface DriverApplicationForm extends FirestoreDoc {
  // Personal Info
  personalInfo: PersonalInfo

  // Address History (last 3 years)
  addresses: Address[]

  // License Data
  licenses: License[]

  // Driving Experience
  vehicleExperience: VehicleExperience[]

  // Accident & Violation History (last 3 years)
  accidents: Accident[]
  violations: Violation[]
  forfeitures?: string
  deniedLicense: boolean
  suspendedLicense: boolean
  denialSuspensionExplanation?: string

  employmentHistory: Employment[]

  notes?: string
}
