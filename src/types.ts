import type { Component } from "vue/dist/vue.js"

export type AlertType = 'error' | 'success' | 'warning' | 'info'
export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  entity?: string
  entityName?: string
  dueDate: string
}

export type HireStatusType =
  | 'Active'
  | 'Terminated'
  | 'Rehired'
  | 'On Leave'

export interface ComplianceItem {
  documentNumber: string
  expiryDate?: string // ISO string YYYY-MM-DD
  file?: string // Filename
  [key: string]: unknown
}

export interface DocumentLog {
  id: string
  date: string
  fileName: string
  type: string
  entityName: string // Driver Name or Bus Number
  user: string
}

export interface FirestoreDoc {
  id: string
  [key: string]: unknown
}

export interface Driver extends FirestoreDoc {
  firstName: string
  middleName: string
  lastName: string
  dob: string
  ssn: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  hireDate: string
  terminationDate?: string
  hireStatus: 'Active' | 'Inactive' | 'Terminated' | 'Rehired' | 'On Leave'
  bankName?: string
  routingNumber?: string
  accountNumber?: string
  w9Signed?: boolean
  businessName?: string
  taxClassification?: string
  i9EmployerSignature?: string
  ssnDoc?: string
  ssnDocName?: string
  ssnDocFile?: File | null
  ssnDocPreviewUrl?: string

  // Compliance
  cdl: ComplianceItem & { state: string; value?: string }
  medical: ComplianceItem & { registry?: string }
  mvr: ComplianceItem
  drugAlcohol: ComplianceItem
  roadTest: ComplianceItem & { examiner: string; date?: string }

  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export interface DriverRow extends Driver {
  firstName: string
  middleName: string
  lastName: string
  contact?: string
  cdlExp?: string
  medicalExp?: string
  mvrDate?: string
  clearinghouseDate?: string
}

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

export type DriverForm = {
  firstName: string
  middleName: string
  lastName: string
  dob: string
  email: string
  phone: string
  ssn: string
  address: string
  city: string
  state: string
  zip: string
  hireStatus: 'Active' | 'Inactive' | 'Terminated' | 'Rehired' | 'On Leave'
  hireDate: string
  termDate: string
  rehireDate: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  cdlNumber: string
  cdlState: string
  cdlExp: string
  medRegistry: string
  medExp: string
  mvrDate: string
  lastDrugTest: string
  roadTestDate: string
  roadTestExaminer: string
  bankName: string
  routingNumber: string
  accountNumber: string
  w9Signed: boolean
  businessName: string
  taxClassification: string
  i9EmployerSignature: string
  ssnDocName: string
  ssnDocFile: File | null
  ssnDocPreviewUrl: string
}

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'purple'
  | 'green'

export interface Column {
  key: string
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
