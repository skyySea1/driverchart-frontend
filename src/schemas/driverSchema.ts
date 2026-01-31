import { z } from 'zod'
import { DriverSchema, ComplianceItemSchema } from '@/shared/schemas/DriverSchema'
import { pastIsoDate, usPhoneNumber } from '../utils/utils'

// Extends Shared DriverSchema for Form-specific validation messages

export const DriverFormSchema = DriverSchema.extend({
  // Personal Info - Override for required messages
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .pipe(pastIsoDate('Date of birth must be in the past')),
  hireDate: z.string().min(1, 'Hire date is required'),
  terminationDate: z.string().optional(), // Keep optional

  // Compliance Sections - Override to enforce required fields strictly for the form

  license: ComplianceItemSchema.extend({
    documentNumber: z.string().min(1, 'license Number is required'),
    expiryDate: z.string().min(1, 'license Expiration is required'),
    state: z.string().min(2, 'license State is required (2 chars)').max(2),
    value: z.string().optional(),
  }),

  medical: ComplianceItemSchema.extend({
    expiryDate: z.string().min(1, 'Medical Expiration is required'),
    registry: z.string().optional().default(''),
  }),

  mvr: ComplianceItemSchema.extend({
    expiryDate: z.string().min(1, 'MVR Date is required'),
  }),

  drugAlcohol: ComplianceItemSchema.extend({
    expiryDate: z.string().min(1, 'Drug test date is required'),
  }),

  roadTest: ComplianceItemSchema.extend({
    date: z.string().min(1, 'Road test date is required'),
    examiner: z.string().min(1, 'Examiner name is required'),
    expiryDate: z.string().optional(),
  }),

  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z
      .string()
      .min(1, 'Emergency contact phone is required')
      .pipe(usPhoneNumber('Emergency contact phone is required')),
    relationship: z.string().min(1, 'Emergency contact relationship is required'),
  }),
})

export type DriverFormData = z.infer<typeof DriverFormSchema>
