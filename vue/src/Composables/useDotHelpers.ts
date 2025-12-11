import dayjs from 'dayjs'

export function statusColorFor(dateStr: string | null | undefined): string {
  if (!dateStr) return 'text-gray-400'
  const d = dayjs(dateStr)
  // Valida se a data é válida
  if (!d.isValid()) return 'text-gray-400'
  const now = dayjs()
  if (d.isBefore(now, 'day')) return 'text-red-600'
  if (d.isBefore(now.add(30, 'day'), 'day')) return 'text-yellow-500'
  return 'text-green-600'
}

export function isExpiringWithin(dateStr: string | null | undefined, days = 30): boolean {
  if (!dateStr) return true
  // Valida se days é positivo
  if (days < 0) return false
  const d = dayjs(dateStr)
  // Valida se a data é válida
  if (!d.isValid()) return true
  return d.isBefore(dayjs().add(days, 'day'))
}
