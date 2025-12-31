// src/Composables/useCompliance.ts
import dayjs from 'dayjs'
import { ca } from 'zod/locales'

// use destructuuring for import functions from this composable

export function useCompliance(today = dayjs().startOf('day')) {
  /**
   * Checks if a date is within the "warning" window (30 days) or expired.
   * @param dateStr ISO date string
   * @param dateStr ISO date string
   * @param warningDays Days threshold for warning
   * @returns true if expired or expiring soon
   */
  function isExpiringSoon(dateStr?: string, warningDays = 30): boolean {
    if (!dateStr) return false
    const diff = dayjs(dateStr).diff(today, 'day')
    // diff < 0 is expired
    // diff <= warningDays is expiring soon
    return diff <= warningDays
  }

  /**
   * Checks if a date is in the past.
   * @param dateStr ISO date string
   * @returns true if expired
   */
  function isExpired(dateStr?: string): boolean {
    if (!dateStr) return false
    return dayjs(dateStr).isBefore(today, 'day')
  }

  /**
   * Returns a Tailwind class for the status badge color based on expiration.
   * Requires dynamic classes for works with Tailwind CSS.
   * @param dateStr ISO date string
   */
  function getStatusColor(dateStr?: string): string {
    if (!dateStr) return 'text-slate-500' // Unknown/Missing
    if (isExpired(dateStr)) return 'bg-red-100 text-red-800'
    if (isExpiringSoon(dateStr)) return 'bg-amber-100 text-amber-800' // expire in 60 days
    return 'bg-green-100 text-green-800'
  }

  function daysToExpire(dateStr?: string): number | string {
    if (!dateStr) return '-'
    const today = dayjs().startOf('day')
    const exp = dayjs(dateStr)
    const diff = exp.diff(today, 'day')

    if (diff >= 30) return ''
    if (diff >= 0) return `due in ${diff} days`
    return 'Expired'
  }

function capitalize(str: string ): string {
 return str.replace(/\b\w/g, c => c.toUpperCase())

}

  return {
    isExpiringSoon,
    isExpired,
    getStatusColor,
    daysToExpire,
  
  }
}
