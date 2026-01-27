import { describe, it, expect } from 'vitest'
import { getChangedFields } from '@/utils/utils'

describe('getChangedFields', () => {
  it('returns undefined for identical primitives', () => {
    expect(getChangedFields('a', 'a')).toBeUndefined()
    expect(getChangedFields(1, 1)).toBeUndefined()
    expect(getChangedFields(true, true)).toBeUndefined()
  })

  it('returns new value for changed primitives', () => {
    expect(getChangedFields('a', 'b')).toBe('b')
    expect(getChangedFields(1, 2)).toBe(2)
    expect(getChangedFields(false, true)).toBe(true)
  })

  it('treats null, undefined, empty string as equivalent', () => {
    expect(getChangedFields(null, '')).toBeUndefined()
    expect(getChangedFields(undefined, '')).toBeUndefined()
    expect(getChangedFields('', null)).toBeUndefined()
    // But distinct from value
    expect(getChangedFields('', 'val')).toBe('val')
  })

  it('returns undefined for identical objects', () => {
    const obj = { a: 1, b: 'c' }
    expect(getChangedFields(obj, { ...obj })).toBeUndefined()
  })

  it('returns only changed fields in object', () => {
    const v1 = { a: 1, b: 'old' }
    const v2 = { a: 1, b: 'new' }
    expect(getChangedFields(v1, v2)).toEqual({ b: 'new' })
  })

  it('handles nested objects recursively', () => {
    const v1 = { nested: { x: 1, y: 1 } }
    const v2 = { nested: { x: 1, y: 2 } }
    expect(getChangedFields(v1, v2)).toEqual({ nested: { y: 2 } })
  })

  it('returns only new keys in nested objects', () => {
    // Current implementation iterates current keys.
    const v1 = { nested: { x: 1 } }
    const v2 = { nested: { x: 1, y: 2 } }
    expect(getChangedFields(v1, v2)).toEqual({ nested: { y: 2 } }) // y is new
  })
  // This test suite should include a test case for key removal to ensure complete coverage.
  it('correctly handles dates', () => {
    const d1 = new Date('2025-01-01')
    const d2 = new Date('2025-01-01')
    const d3 = new Date('2025-01-02')

    expect(getChangedFields(d1, d2)).toBeUndefined()
    expect(getChangedFields(d1, d3)).toEqual(d3)
  })

  it('handles array comparisons (simple)', () => {
    expect(getChangedFields([1, 2], [1, 2])).toBeUndefined()
    expect(getChangedFields([1], [1, 2])).toEqual([1, 2])
  })
})
