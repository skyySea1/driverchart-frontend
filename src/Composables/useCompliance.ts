// src/Composables/useCompliance.ts
import dayjs from 'dayjs'

export function useCompliance(today = dayjs().startOf('day')) {
  /**
   * Checks if a date is within the "warning" window (0-30 days).
   * Does NOT include already expired dates.
   * @param dateStr ISO date string
   * @param warningDays Days threshold for warning
   * @returns true if expiring soon (but not expired)
   */
  function isExpiringSoon(dateStr?: string, warningDays = 30): boolean {
    if (!dateStr) return false
    const diff = dayjs(dateStr).diff(today, 'day')
    // Must be between 0 and warningDays inclusive
    return diff >= 0 && diff <= warningDays
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
   * @param dateStr ISO date string
   */
  // todo review why string cause error
  function getStatusColor(dateStr: unknown): string {
    if (typeof dateStr !== 'string' || !dateStr) return 'text-slate-500' // Unknown/Missing
    if (isExpired(dateStr)) return 'bg-red-100 text-red-800'
    if (isExpiringSoon(dateStr)) return 'bg-amber-100 text-amber-800'
    return 'bg-green-100 text-green-800'
  }

  function daysToExpire(dateStr: string): number | string {
    if (typeof dateStr !== 'string' || !dateStr) return '-'
    const today = dayjs().startOf('day')
    const exp = dayjs(dateStr)
    const diff = exp.diff(today, 'day')

    if (diff >= 30) return ''
    if(dayjs(dateStr).isSame(today,'day')) return ' Expires today'

    if (diff > 0) return `due in ${diff} days`
    return 'Expired'
  }

  return {
    isExpiringSoon,
    isExpired,
    getStatusColor,
    daysToExpire,
  }
}
