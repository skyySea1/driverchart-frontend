import type { comparedValues } from '@/types'
import { z } from 'zod'
import dayjs from 'dayjs'
import isEqual from 'fast-deep-equal'

export const getDaysDiff = (dateStr: string | null | undefined): number => {
  if (!dateStr) return 0
  const today = new Date()
  const target = new Date(dateStr)
  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const getDaysUntilDue = (lastDateStr: string | null | undefined): number => {
  if (!lastDateStr) return 0
  const lastDate = new Date(lastDateStr)
  const dueDate = new Date(lastDate)
  dueDate.setFullYear(lastDate.getFullYear() + 1)
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const getStatusColor = (days: number): string => {
  if (days < 0) return 'text-red-600 bg-red-100 border-red-200'
  if (days < 30) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
  return 'text-green-600 bg-green-100 border-green-200'
}

export const getStatusText = (days: number): string => {
  if (days < 0) return 'EXPIRED'
  if (days < 30) return `Due in ${days} days`
  return 'Valid'
}

export const formatDate = (
  timestamp: Date | string | number | { toDate: () => Date } | null | undefined,
  withTime: boolean = false,
): string => {
  if (!timestamp) return 'N/A'
  let date: Date
  if ((timestamp as { toDate?: () => Date })?.toDate) {
    date = (timestamp as { toDate: () => Date }).toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    date = new Date(timestamp as string | number)
  }

  if (isNaN(date.getTime())) return 'Invalid Date'
  if (withTime) {
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  }
  return date.toLocaleDateString()
}

/**
 * Sanitizes input string: Trims, Uppercases, and removes potentially dangerous characters.
 * Allows letters, numbers, spaces, and basic punctuation (.,-).
 */
export const sanitizeInput = (str: string): string => {
  if (!str) return ''
  return str
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9\s.,-]/g, '') // Basic whitelist
}

/**
 * Capitalizes a name for display (Title Case).
 * e.g., "JOHN DOE" -> "John Doe"
 */
export const capitalizeName = (str: string): string => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getHireStatusColor(status: unknown) {
  const s = typeof status === 'string' ? status : ''
  switch (s) {
    case 'Active':
      return 'bg-green-100 border-green-500 text-green-800'
    case 'Terminated':
      return 'bg-red-100 border-red-500 text-red-800'
    case 'Rehired':
      return 'bg-blue-100 border-blue-500 text-blue-500'
    case 'Pending':
      return 'bg-amber-100 border-amber-500 text-amber-600'
    default:
      return 'bg-slate-50 border-slate-300 text-slate-500'
  }
}

/**
 * Generic comparison for sorting.
 * Handles strings (localeCompare) and numbers.
 * Treats null/undefined as empty strings/lowest value.
 */
export function compareValues(a: comparedValues, b: comparedValues, order: 'asc' | 'desc'): number {
  const aVal = a ?? ''
  const bVal = b ?? ''

  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  }

  // Cast for generic comparison since we handled strings/nulls
  if (aVal < bVal) return order === 'asc' ? -1 : 1
  if (aVal > bVal) return order === 'asc' ? 1 : -1
  return 0
}

export const cleanFileName = (name: string) => {
  try {
    // Decode URL entities like %2F
    const decoded = decodeURIComponent(name)
    // Take the last part after /
    const parts = decoded.split('/')
    const fileName = parts[parts.length - 1]
    // Remove query params if any
    return fileName ? fileName.split('?')[0] : ''
  } catch {
    return name
  }
}

export const futureIsoDate = (message = 'Date must be in the future') =>
  z
    .string()
    .min(1, { message })
    .pipe(z.iso.date())
    .refine((dateStr) => dayjs(dateStr).isAfter(dayjs()), { message })

export const pastIsoDate = (message = 'Date must be in the past') =>
  z
    .string()
    .min(1, { message })
    .pipe(z.iso.date())
    .refine((dateStr) => dayjs(dateStr).isBefore(dayjs()), { message })

export const usPhoneNumber = (message = 'Phone must be in format (XXX) XXX-XXXX or XXX-XXX-XXXX') =>
  z.string().regex(/^(\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/, message)

export const formatSSN = (value: string | undefined | null): string => {
  if (!value) return ''
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Format as AAA-GG-SSSS
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`
}

/**
 * Deeply compares two objects and returns a partial object containing only the changed fields.
 * Treats null, undefined, and empty string as equivalent "empty" values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChangedFields = (original: any, current: any): any => {
  // 1. Primitive comparison
  if (original === current) return undefined

  // 2. Handle "Empty" equivalence (null == undefined == "")
  const isEmpty = (v: unknown) => v === null || v === undefined || v === ''
  if (isEmpty(original) && isEmpty(current)) return undefined

  // 3. Date handling (compare values)
  if (original instanceof Date && current instanceof Date) {
    return original.getTime() === current.getTime() ? undefined : current
  }

  // 4. Object handling (recursive)
  if (
    typeof original === 'object' &&
    typeof current === 'object' &&
    original !== null &&
    current !== null
  ) {
    // Array handling
    if (Array.isArray(original) || Array.isArray(current)) {
      // For arrays, simplistic approach: if strictly different JSON, return current
      return isEqual(original, current) ? undefined : current
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diff: any = {}
    let hasChanges = false

    // Check keys in current
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const change = getChangedFields(original[key], current[key])
        if (change !== undefined) {
          diff[key] = change
          hasChanges = true
        }
      }
    }

    return hasChanges ? diff : undefined
  }

  // 5. Value mismatch
  return current
}
