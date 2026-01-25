import { computed } from 'vue'
import dayjs from 'dayjs'
import { useRealtimeCollection } from '@/Composables/useRealtimeCollection'
import type { Driver } from '@/types'
import { parseDriverDoc } from '@/utils/firestoreParsers'

export interface NotificationItem {
  driverId: string
  driverName: string
  email: string
  documentType: string
  dueDate: string
  daysLeft: number
}

export function useNotifications() {
  const { items: driversItems, loading } = useRealtimeCollection<Driver>(
    `artifacts/${import.meta.env.VITE_APP_ID}/public/data/drivers`,
    { map: parseDriverDoc },
  )

  const expiringNotifications = computed(() => {
    const list: NotificationItem[] = []
    const today = dayjs().startOf('day')

    driversItems.value.forEach((d) => {
      if (!d.email) return

      const check = (date: string | undefined, type: string) => {
        if (!date) return
        const due = dayjs(date)
        const diff = due.diff(today, 'day')

        if (diff <= 30) {
          list.push({
            driverId: d.id!,
            driverName: `${d.firstName} ${d.lastName}`,
            email: d.email,
            documentType: type,
            dueDate: date,
            daysLeft: diff,
          })
        }
      }

      check(d.license?.expiryDate, 'Driver License')
      check(d.medical?.expiryDate, 'Medical Card')
      check(d.mvr?.expiryDate, 'MVR')
      check(d.drugAlcohol?.expiryDate, 'Clearinghouse')
    })

    return list
  })

  return {
    expiringNotifications,
    loading,
  }
}
