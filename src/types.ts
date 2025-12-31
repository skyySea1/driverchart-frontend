export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  entity?: string
  entityName?: string
  dueDate: string
}

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

export interface DriverRow extends Driver {
  contact?: string
  cdlExp?: string
  medicalExp?: string
  mvrDate?: string
  clearinghouseDate?: string
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

export type ViewState =
  | 'dashboard'
  | 'drivers'
  | 'vehicles'
  | 'auditreports '
  | 'documentregistry'
  | 'applications'
  | 'login'
  | 'settings'