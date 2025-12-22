import type { Vehicle } from '../../types'

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    busNumber: '101',
    vin: '1HV234567890ABCDE',
    status: 'Active',
    lastAnnualInspection: '2023-11-20',
    mileage: 45200
  },
  {
    id: 'v2',
    busNumber: '202',
    vin: '2HV987654321ZYXWV',
    status: 'Maintenance',
    lastAnnualInspection: '2023-05-10',
    mileage: 120500
  },
  {
    id: 'v3',
    busNumber: '303',
    vin: '3HV111222333BBBBB',
    status: 'Active',
    lastAnnualInspection: '2024-01-05',
    mileage: 15400

  }
]
