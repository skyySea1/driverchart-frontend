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
): string => {
  if (!timestamp) return 'Just now'
  let date: Date
  if ((timestamp as { toDate?: () => Date })?.toDate) {
    date = (timestamp as { toDate: () => Date }).toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    date = new Date(timestamp as string | number)
  }

  if (isNaN(date.getTime())) return 'Invalid Date'
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}
