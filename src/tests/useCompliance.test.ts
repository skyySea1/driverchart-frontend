import { describe, it, expect } from 'vitest'
import { useCompliance } from '@/Composables/useCompliance'
import dayjs from 'dayjs'

describe('useCompliance Logic', () => {
  const today = dayjs().startOf('day')
  // Instantiate composable with mocked today for consistency
  const { isExpired, isExpiringSoon, getStatusColor, daysToExpire } = useCompliance(today)

  it('isExpired identifies past dates correctly', () => {
    const yesterday = today.subtract(1, 'day').toISOString()
    const tomorrow = today.add(1, 'day').toISOString()
    
    expect(isExpired(yesterday)).toBe(true)
    expect(isExpired(tomorrow)).toBe(false)
    expect(isExpired(undefined)).toBe(false)
  })

  it('isExpiringSoon identifies dates within 30 days', () => {
    const soon = today.add(15, 'day').toISOString()
    const far = today.add(45, 'day').toISOString()
    const past = today.subtract(1, 'day').toISOString()

    expect(isExpiringSoon(soon)).toBe(true)
    expect(isExpiringSoon(far)).toBe(false)
    expect(isExpiringSoon(past)).toBe(false) // Expired is not "expiring soon", it's expired
    expect(isExpiringSoon(undefined)).toBe(false)
  })

  it('getStatusColor returns correct classes', () => {
    const expired = today.subtract(1, 'day').toISOString()
    const soon = today.add(15, 'day').toISOString()
    const valid = today.add(60, 'day').toISOString()

    expect(getStatusColor(expired)).toBe('bg-red-100 text-red-800')
    expect(getStatusColor(soon)).toBe('bg-amber-100 text-amber-800')
    expect(getStatusColor(valid)).toBe('bg-green-100 text-green-800')
    expect(getStatusColor(null)).toBe('text-slate-500')
  })

  it('daysToExpire calculates correct difference', () => {
    const target = today.add(10, 'day').toISOString()
    // Difference might be 9 or 10 depending on exact time, checking rough range or exact day diff
    const diff = dayjs(target).diff(today, 'day')
    expect(daysToExpire(target)).toBe(`due in ${diff} days`)
    expect(daysToExpire(null)).toBe('-')
  })
})
