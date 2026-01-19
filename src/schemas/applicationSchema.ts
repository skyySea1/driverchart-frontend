import { z } from 'zod'
import { pastIsoDate, usPhoneNumber } from '../utils/utils'

// Personal Info
export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional().default(''),
  lastName: z.string().min(1, 'Last name is required'),
  dob: pastIsoDate('Date of birth is required'),
  email: z.email('Invalid email address'),
  phone: usPhoneNumber('Phone must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX'),
  ssnNumber: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
    .or(z.literal('')),
})

// Address History (last 3 years)
export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  fromDate: pastIsoDate('From date is required'),
  toDate: z.string().optional(), // Optional for current address
})

// License
export const LicenseSchema = z.object({
  number: z.string().min(1, 'License number is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  class: z.string().min(1, 'License class is required'),
  endorsements: z.string().default(''),
  restrictions: z.string().default(''),
  expirationDate: z
    .string()
    .min(1, 'Expiration date is required'),
})

// Accident
export const AccidentSchema = z.object({
  date: z.string().min(1, 'Accident date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  injuries: z.boolean().default(false),
  fatalities: z.boolean().default(false),
})

// Violation
export const ViolationSchema = z.object({
  date: z.string().min(1, 'Violation date is required'),
  violation: z.string().min(1, 'Violation description is required'),
  location: z.string().min(1, 'Location is required'),
  penalty: z.string().min(1, 'Penalty is required'),
})

// Employment History
export const EmploymentSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  phone: usPhoneNumber('Phone must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX'),
  position: z.string().min(1, 'Position is required'),
  fromDate: pastIsoDate('From date is required'),
  toDate: z.string().min(1, 'To date is required').optional(), // Optional for current employment
  reasonForLeaving: z.string().default(''),
  wasCDL: z.boolean().default(false),
})

// Driver Application Form Schema
export const DriverApplicationFormSchema = z.object({
  id: z.string().optional(),
  personalInfo: PersonalInfoSchema,
  addresses: z.array(AddressSchema).min(1, 'At least one address is required'),
  licenses: z.array(LicenseSchema).min(1, 'At least one license is required'),
  vehicleTypes: z.array(z.string()).default([]),
  experienceYears: z.number().min(0, 'Experience years cannot be negative').default(0),
  accidents: z.array(AccidentSchema).default([]),
  violations: z.array(ViolationSchema).default([]),
  employmentHistory: z.array(EmploymentSchema).default([]),
  notes: z.string().optional().default(''),
})

export type DriverApplicationFormData = z.infer<typeof DriverApplicationFormSchema>
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type Address = z.infer<typeof AddressSchema>
export type License = z.infer<typeof LicenseSchema>
export type Accident = z.infer<typeof AccidentSchema>
export type Violation = z.infer<typeof ViolationSchema>
export type Employment = z.infer<typeof EmploymentSchema>
