import { z } from 'zod'

export const DriverFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().default(''),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.iso.date({error: 'Date of birth is required'}),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.email('Invalid email address').or(z.literal('')),

  hireDate: z.iso.date({error: 'Hire date is required'}),
  hireStatus: z.enum(['Active', 'Inactive', 'Terminated', 'Rehired', 'On Leave']).default('Active'),

  cdlNumber: z.string().min(1, 'CDL Number is required'),
  cdlState: z.string().min(2, 'CDL State is required (2 chars)').max(2),
  cdlExp: z.iso.date({error: 'CDL Expiration is required'}),

  medRegistry: z.string().optional().default(''),
  medExp: z.iso.date({error: 'Medical Expiration is required'}),
  mvrDate: z.iso.date({error: 'MVR Date is required'}),
  lastDrugTest: z.iso.date({error: 'Drug test date is required'}),

  roadTestDate: z.iso.date({error: 'Road test date is required'}),
  roadTestExaminer: z.string().min(1, 'Examiner name is required'),

  // Optional fields
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zip: z.string().optional().default(''),
  ssn: z.string().optional().default(''),
  bankName: z.string().optional().default(''),
  routingNumber: z.string().optional().default(''),
  accountNumber: z.string().optional().default(''),
  emergencyName: z.string().optional().default(''),
  emergencyPhone: z.string().optional().default(''),
  emergencyRelationship: z.string().optional().default(''),
})

export type DriverFormData = z.infer<typeof DriverFormSchema>
