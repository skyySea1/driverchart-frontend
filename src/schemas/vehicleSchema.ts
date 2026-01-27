import { z } from 'zod'

export const VehicleSchema = z.object({
  busNumber: z.string().min(1, 'Bus number is required').default(''),
  vin: z.string().min(1, 'VIN is required').default(''),
  vehicleStatus: z.enum(['Active', 'Maintenance', 'Inactive']).default('Active'),
  lastAnnualInspection: z.iso.date('Last inspection date is required').default(''),
  mileage: z.number().nonnegative('Mileage cannot be negative').default(0),
})

export type VehicleFormData = z.infer<typeof VehicleSchema>
