import type { Application } from '../../types'

export const mockApplications: Application[] = [
  {
    id: 'app1',
    firstName: 'Michael',
    lastName: 'Jordan',
    email: 'mj@example.com',
    phone: '555-0101',
    status: 'Pending',
    appliedDate: '2023-12-01',
    experienceYears: 5,
    cdlNumber: 'A1234567',
    notes: 'Experienced driver'
  },
  {
    id: 'app2',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah@example.com',
    phone: '555-0102',
    status: 'Approved',
    appliedDate: '2023-11-25',
    experienceYears: 2,
    cdlNumber: 'B7654321'
  },
  {
    id: 'app3',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phone: '555-0103',
    status: 'Rejected',
    appliedDate: '2023-11-20',
    experienceYears: 0,
    notes: 'No CDL'
  }
]
