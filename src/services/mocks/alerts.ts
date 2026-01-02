import type { Alert } from '@/types'

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'critical',
    message: 'Medical Card Expired',
    entity: 'Alice Smith',
    dueDate: '2024-02-15',
  },
  {
    id: 'a2',
    type: 'warning',
    message: 'Annual Inspection Due',
    entity: 'Bus 202',
    dueDate: '2024-05-10',
  },
  {
    id: 'a3',
    type: 'info',
    message: 'Drug & Alcohol Clearinghouse renewal',
    entity: 'John Doe',
    dueDate: '2025-01-15',
  },
]
