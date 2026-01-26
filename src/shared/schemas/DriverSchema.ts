import { usPhoneNumber, pastIsoDate } from '@/utils/utils.ts'
import { z } from 'zod'

export const ComplianceItemSchema = z.object({
  documentNumber: z.string().default(''),
  expiryDate: z.iso.date().optional(),
  file: z.string().optional(),
})
export const DriverSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().default(''),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.iso
    .date()
    .min(1, 'Date of birth is required')
    .pipe(pastIsoDate('Date of birth must be in the past')),
  ssnNumber: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
    .or(z.literal('')),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .pipe(usPhoneNumber('Phone Number must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX')),
  email: z.email('Invalid email address').or(z.literal('')),
  address: z.string().default(''),
  city: z.string().default(''),
  state: z.string().default(''),
  zip: z.string().default(''),
  // Employment
  hireDate: z.iso.date(),
  terminationDate: z.iso.date().optional(),
  hireStatus: z.enum(['Active', 'Terminated', 'Rehired', 'Pending']).default('Active'),

  // Banking / Tax / Legal
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  w9Signed: z.boolean().optional().default(false),
  businessName: z.string().optional(),
  taxClassification: z.string().optional(),
  i9EmployerSignature: z.string().optional(),
  ssnDoc: z.string().optional(),
  ssnDocName: z.string().optional(),

  // Compliance Sections
  license: ComplianceItemSchema.extend({
    state: z.string().default(''),
    value: z.string().optional(),
  }),

  medical: ComplianceItemSchema.extend({
    registry: z.string().optional().default(''),
  }),

  mvr: ComplianceItemSchema,
  drugAlcohol: ComplianceItemSchema,

  roadTest: ComplianceItemSchema.extend({
    examiner: z.string().default(''),
    date: z.iso.date().optional(),
    expiryDate: z.iso.date().optional(),
  }),

  emergencyContact: z.object({
    name: z.string().default(''),
    phone: z
      .string('Emergency contact phone is required')
      .default('')
      .pipe(usPhoneNumber('Phone Number must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX')),
    relationship: z.string().default(''),
  }),

  // Qualification Checklist (Permanent Tracking)
  qualificationChecklist: z
    .object({
      dotApplication: z.boolean().default(false),
      drivingRecordInquiry: z.boolean().default(false),
      goodFaithEffort: z.boolean().default(false),
      roadTest: z.boolean().default(false),
      medicalCertificate: z.boolean().default(false),
      medicalRegistryVerification: z.boolean().default(false),
      annualDrivingReview: z.boolean().default(false),
      cdlisReport: z.boolean().default(false),
      drugAlcoholClearinghouse: z.boolean().default(false),
      preEmploymentDrugTest: z.boolean().default(false),
      randomProgramPlacement: z.boolean().default(false),
      companyTestingPolicyReceipt: z.boolean().default(false),
      drugAlcoholStatement: z.boolean().default(false),
      // Completion timestamps
      completedAt: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  
  // Application Reference
  applicationId: z.string().optional(),
  appliedDate: z.string().optional(),
  applicationFile: z.string().optional(),

  // Application Signatures (preserved during migration)
  drugTestSignature: z.string().optional().default(''),
  drugTestDate: z.string().optional().default(''),
  authReleaseSignature: z.string().optional().default(''),
  authReleaseDate: z.string().optional().default(''),
  pspDisclosureSignature: z.string().optional().default(''),
  pspDisclosureDate: z.string().optional().default(''),
  fmcsaConsentSignature: z.string().optional().default(''),
  fmcsaConsentDate: z.string().optional().default(''),
  alcoholDrugPolicySignature: z.string().optional().default(''),
  alcoholDrugPolicyDate: z.string().optional().default(''),
  generalWorkPolicySignature: z.string().optional().default(''),
  generalWorkPolicyDate: z.string().optional().default(''),
  fairCreditReportingSignature: z.string().optional().default(''),
  fairCreditReportingDate: z.string().optional().default(''),
})

export type Driver = z.infer<typeof DriverSchema>
