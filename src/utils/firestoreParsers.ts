import type { Driver, FirestoreDoc, Vehicle } from '@/types'

function getProp(obj: unknown, key: string): unknown {
  if (typeof obj !== 'object' || obj === null) return undefined
  return Reflect.get(obj, key)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function asHireStatus(value: unknown): Driver['hireStatus'] {
  if (value === 'Terminated') return 'Terminated'
  if (value === 'Rehired') return 'Rehired'
  return 'Active'
}

function asVehicleStatus(value: unknown): Vehicle['vehicleStatus'] {
  switch (value) {
    case 'Active':
    case 'Maintenance':
      return value
    default:
      return 'Active'
  }
}

export function parseDriverDoc(doc: FirestoreDoc): Driver {
  const cdl = getProp(doc, 'cdl')
  const medical = getProp(doc, 'medical')
  const mvr = getProp(doc, 'mvr')
  const drugAlcohol = getProp(doc, 'drugAlcohol')
  const roadTest = getProp(doc, 'roadTest')
  const emergencyContact = getProp(doc, 'emergencyContact')

  return {
    id: asString(getProp(doc, 'id')),

    firstName: asString(getProp(doc, 'firstName')),
    middleName: asString(getProp(doc, 'middleName')),
    lastName: asString(getProp(doc, 'lastName')),
    dob: asString(getProp(doc, 'dob')),
    ssn: asString(getProp(doc, 'ssn')),
    phone: asString(getProp(doc, 'phone')),
    email: asString(getProp(doc, 'email')),
    address: asString(getProp(doc, 'address')),
    city: asString(getProp(doc, 'city')),
    state: asString(getProp(doc, 'state')),
    zip: asString(getProp(doc, 'zip')),

    hireDate: asString(getProp(doc, 'hireDate')),
    terminationDate: asOptionalString(getProp(doc, 'terminationDate')),
    hireStatus: asHireStatus(getProp(doc, 'hireStatus')),

    bankName: asOptionalString(getProp(doc, 'bankName')),
    routingNumber: asOptionalString(getProp(doc, 'routingNumber')),
    accountNumber: asOptionalString(getProp(doc, 'accountNumber')),
    w9Signed: asBoolean(getProp(doc, 'w9Signed')),
    businessName: asOptionalString(getProp(doc, 'businessName')),
    taxClassification: asOptionalString(getProp(doc, 'taxClassification')),
    i9EmployerSignature: asOptionalString(getProp(doc, 'i9EmployerSignature')),
    ssnDoc: asOptionalString(getProp(doc, 'ssnDoc')),
    ssnDocName: asOptionalString(getProp(doc, 'ssnDocName')),
    ssnDocFile: undefined,
    ssnDocPreviewUrl: asOptionalString(getProp(doc, 'ssnDocPreviewUrl')),

    cdl: {
      documentNumber: asString(getProp(cdl, 'documentNumber')),
      expiryDate: asOptionalString(getProp(cdl, 'expiryDate')),
      file: asOptionalString(getProp(cdl, 'file')),
      state: asString(getProp(cdl, 'state')),
      value: asOptionalString(getProp(cdl, 'value')),
    },

    medical: {
      documentNumber: asString(getProp(medical, 'documentNumber')),
      expiryDate: asOptionalString(getProp(medical, 'expiryDate')),
      file: asOptionalString(getProp(medical, 'file')),
      registry: asString(getProp(medical, 'registry')),
    },

    mvr: {
      documentNumber: asString(getProp(mvr, 'documentNumber')),
      expiryDate: asOptionalString(getProp(mvr, 'expiryDate')),
      file: asOptionalString(getProp(mvr, 'file')),
    },

    drugAlcohol: {
      documentNumber: asString(getProp(drugAlcohol, 'documentNumber')),
      expiryDate: asOptionalString(getProp(drugAlcohol, 'expiryDate')),
      file: asOptionalString(getProp(drugAlcohol, 'file')),
    },

    roadTest: {
      documentNumber: asString(getProp(roadTest, 'documentNumber')),
      expiryDate: asOptionalString(getProp(roadTest, 'expiryDate')),
      file: asOptionalString(getProp(roadTest, 'file')),
      examiner: asString(getProp(roadTest, 'examiner')),
      date: asOptionalString(getProp(roadTest, 'date')),
    },

    emergencyContact: {
      name: asString(getProp(emergencyContact, 'name')),
      phone: asString(getProp(emergencyContact, 'phone')),
      relationship: asString(getProp(emergencyContact, 'relationship')),
    },
  }
}

export function parseVehicleDoc(doc: FirestoreDoc): Vehicle {
  return {
    id: asString(getProp(doc, 'id')),
    busNumber: asString(getProp(doc, 'busNumber')),
    vin: asString(getProp(doc, 'vin')),
    vehicleStatus: asVehicleStatus(getProp(doc, 'vehicleStatus')),
    lastAnnualInspection: asString(getProp(doc, 'lastAnnualInspection')),
    mileage: asNumber(getProp(doc, 'mileage'), 0),
    inspectionFile: asOptionalString(getProp(doc, 'inspectionFile')),
  }
}
