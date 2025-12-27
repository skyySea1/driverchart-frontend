export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  entity?: string
  // owner of alert, either driver id or vehicle id, v.busnumber ou v.driverid
  dueDate: string
}

export interface ComplianceItem {
  documentNumber: string
  expiryDate?: string // ISO string YYYY-MM-DD
  file?: string // Filename mock
  [key: string]: unknown // allow extra properties during transition
}

export interface DocumentLog {
  id: string
  date: string
  fileName: string
  type: string
  entityName: string // Driver Name or Bus Number
  user: string
}

export interface Driver {
  id: string
  firstName: string
  middleName: string
  lastName: string
  dob: string
  birthDate?: string
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
  mvr: ComplianceItem // Annual review
  drugAlcohol: ComplianceItem
  roadTest: ComplianceItem & { examiner: string; date?: string }

  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
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

export interface Vehicle {
  id: string
  busNumber: string
  vin: string
  vehicleStatus: 'Active' | 'Maintenance' | 'Inactive'
  lastAnnualInspection: string // YYYY-MM-DD
  mileage: number
  inspectionFile?: string
}

export type ViewState =
  | 'dashboard'
  | 'drivers'
  | 'vehicles'
  | 'auditreports '
  | 'documentregistry'
  | 'applications'
  | 'specs'
  | 'login'
  | 'settings'
