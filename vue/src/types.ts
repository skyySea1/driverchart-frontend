export interface DocumentLog {
  id: string;
  date: string;
  fileName: string;
  type: string;
  entityName: string; // Driver Name or Bus Number
  user: string;
}

export interface ComplianceItem {
  value: string;
  expiryDate?: string; // ISO string YYYY-MM-DD
  file?: string; // Filename mock
}

export interface Driver {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  ssn: string;
  phone: string;
  email: string;
  hireDate: string;
  terminationDate?: string;
  status: 'Active' | 'Inactive' | 'Terminated';

  // Compliance
  cdl: ComplianceItem & { state: string };
  medical: ComplianceItem;
  mvr: ComplianceItem; // Annual review
  drugAlcohol: ComplianceItem;
  roadTest: ComplianceItem & { examiner: string; date?: string };

  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface Vehicle {
  id: string;
  busNumber: string;
  vin: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  lastAnnualInspection: string; // YYYY-MM-DD
  mileage: number;
  inspectionFile?: string;
}

export type ViewState = 'dashboard' | 'drivers' | 'fleet' | 'registry' | 'reports' | 'specs' | 'login' | 'settings';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  entity?: string;
  // owner of alert, either driver id or vehicle id, v.busnumber ou v.driverid
  dueDate: string;

}
