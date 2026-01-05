// TODO MOVE NAVIGATION UTILITIES HERE FROM OTHER FILES
import type { Alert } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()

export const navigateToDriver = (alert: Alert) => {
  const driverName = alert.entityName || alert.entity
  if (driverName) {
    router.push({
      path: '/drivers',
      query: { search: driverName }
    })
  }
}
