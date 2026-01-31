// src/utils/constants.ts

const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID || 'driverchart'

export const STATUS_ACTIVE = 'Active'
export const STATUS_INACTIVE = 'Inactive'
export const MOBILE_BREAKPOINT = 768
export const SYSTEM_USER_CURRENT = 'current user'
export const SYSTEM_USER_SYSTEM = 'system'
export const SYSTEM_USERS = [SYSTEM_USER_CURRENT, SYSTEM_USER_SYSTEM] as const

export const STATUS_MAINTENANCE = 'Maintenance'
export const APP_NAME = 'CharterSafe'
export const APP_VERSION = '1.0.0'
export const COMPANY_NAME = 'PhoenixBus Orlando'

export const COLLECTION_PATHS = {
  drivers: `artifacts/${COLLECTION_ID}/public/data/drivers`,
  vehicles: `artifacts/${COLLECTION_ID}/public/data/vehicles`,
  applications: `artifacts/${COLLECTION_ID}/public/data/applications`,
  users: `artifacts/${COLLECTION_ID}/public/data/users`,
}

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
]

export const VEHICLE_TYPES = [
  'Passenger Bus',
  'School Bus',
  'Charter Bus',
  'Straight Truck',
  'Semi-Truck/Trailer',
  'Van/Doubles',
  'Tractor',
]

export const ORGANIZATION = {
  name: 'Phoenix Bus Orlando',
  domain: 'phoenixbusorlando.com',
  address: 'Orlando, FL',
  email: 'contact@phoenixbusorlando.com',
}
