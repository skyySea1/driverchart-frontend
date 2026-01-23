import { z } from 'zod'
import { usPhoneNumber, pastIsoDate } from '@/utils/utils'

// Reusable basic schemas
const textRequired = (label: string) => z.string().min(1, `${label} is required`)
const dateRequired = (label: string) => z.string().min(1, `${label} is required`).refine(val => !isNaN(Date.parse(val)), `Invalid date for ${label}`)

// Address Schema
export const AddressSchema = z.object({
  street: textRequired('Street Address'),
  city: textRequired('City'),
  state: textRequired('State').length(2, 'State must be 2 letters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  fromDate: dateRequired('From Date'),
  toDate: z.string().optional(),
  present: z.boolean().optional(),
}).refine((data) => {
  if (data.present) return true;
  return !!data.toDate;
}, {
  message: "To Date is required if not current address",
  path: ["toDate"]
});

// License Schema
export const LicenseSchema = z.object({
  number: textRequired('License Number'),
  state: textRequired('State').length(2, 'State must be 2 letters'),
  class: textRequired('Class'),
  endorsements: z.string().optional(),
  restrictions: z.string().optional(),
  emissionDate: dateRequired('Emission Date'),
  expirationDate: dateRequired('Expiration Date'), // Future date check could be added
});

// Driving Experience (Vehicle Type)
export const VehicleExperienceSchema = z.object({
  type: z.string().min(1, 'Vehicle type is required'),
});

// Accident Schema
export const AccidentSchema = z.object({
  date: dateRequired('Accident Date'),
  location: textRequired('Location'),
  description: textRequired('Description'),
  injuries: z.boolean(),
  fatalities: z.boolean(),
});

// Violation Schema
export const ViolationSchema = z.object({
  date: dateRequired('Violation Date'),
  location: textRequired('Location'),
  violation: textRequired('Violation Type'),
  penalty: z.string().optional(),
});

// Employment History Schema
export const EmploymentSchema = z.object({
  companyName: textRequired('Company Name'),
  address: textRequired('Address'),
  city: textRequired('City'),
  state: textRequired('State').length(2, 'State must be 2 letters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  phone: textRequired('Phone').pipe(usPhoneNumber()),
  position: textRequired('Position'),
  description: z.string().optional(),
  fromDate: dateRequired('From Date'),
  toDate: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  wasCDL: z.boolean(),
  present: z.boolean().optional(),
}).refine((data) => {
  if (data.present) return true;
  return !!data.toDate;
}, {
  message: "To Date is required if not current job",
  path: ["toDate"]
});

// Main Application Schema
export const ApplicationSchema = z.object({
  personalInfo: z.object({
    firstName: textRequired('First Name'),
    middleName: z.string().optional(),
    lastName: textRequired('Last Name'),
    dob: pastIsoDate('Date of Birth must be in the past'),
    email: z.string().email('Invalid email address'),
    phone: textRequired('Phone').pipe(usPhoneNumber()),
    ssnNumber: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
    medicalExpirationDate: dateRequired('Medical Expiration Date'),
  }),

  addresses: z.array(AddressSchema).min(1, 'At least one address is required'),
  
  licenses: z.array(LicenseSchema).min(1, 'At least one license is required'),

  experienceYears: z.number().min(0, 'Experience years must be 0 or greater'),
  vehicleExperience: z.array(VehicleExperienceSchema).optional(),

  accidents: z.array(AccidentSchema).optional(),
  violations: z.array(ViolationSchema).optional(),
  
  forfeitures: z.string().optional(),
  
  deniedLicense: z.boolean(),
  suspendedLicense: z.boolean(),
  denialSuspensionExplanation: z.string().optional(),

  employmentHistory: z.array(EmploymentSchema).optional(), // Can be optional initially, but enforced by logic if needed

  drugTestPositiveOrRefusal: z.boolean(),
  drugTestDocumentation: z.enum(['Yes', 'No', 'N/A']),
  drugTestSignature: textRequired('Drug Test Signature'),
  drugTestDate: dateRequired('Drug Test Date'),

  authReleaseSignature: textRequired('Auth Release Signature'),
  authReleaseDate: dateRequired('Auth Release Date'),

  pspDisclosureSignature: textRequired('PSP Disclosure Signature'),
  pspDisclosureDate: dateRequired('PSP Disclosure Date'),

  fmcsaConsentSignature: textRequired('FMCSA Consent Signature'),
  fmcsaConsentDate: dateRequired('FMCSA Consent Date'),

  alcoholDrugPolicySignature: textRequired('Alcohol & Drug Policy Signature'),
  alcoholDrugPolicyDate: dateRequired('Alcohol & Drug Policy Date'),

  generalWorkPolicySignature: textRequired('General Work Policy Signature'),
  generalWorkPolicyDate: dateRequired('General Work Policy Date'),

  fairCreditReportingSignature: z.string().optional(), // Step 12 seems optional in form? "applicant signature" placeholder suggests required but let's see. logic says required usually.
  fairCreditReportingDate: z.string().optional(),

  notes: z.string().optional(),
  
}).superRefine((data, ctx) => {
  // Conditional Validation: License Denial/Suspension
  if ((data.deniedLicense || data.suspendedLicense) && !data.denialSuspensionExplanation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Explanation is required when license is denied or suspended",
      path: ["denialSuspensionExplanation"]
    });
  }

  // Conditional: Drug Test Documentation
  if (data.drugTestPositiveOrRefusal && data.drugTestDocumentation === 'N/A') {
     ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please indicate if you can provide documentation",
      path: ["drugTestDocumentation"]
    });
  }
});

export type ApplicationFormSchemaType = z.infer<typeof ApplicationSchema>
