import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataService } from '@/services/dataService'
import type { Alert } from '@/types'
import dayjs from 'dayjs'

export interface Notification extends Alert {
  read: boolean
  createdAt: string
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load read status from localStorage
  const getReadStatus = (): Record<string, boolean> => {
    const stored = localStorage.getItem('cs_read_notifications')
    return stored ? JSON.parse(stored) : {}
  }

  const saveReadStatus = (status: Record<string, boolean>) => {
    localStorage.setItem('cs_read_notifications', JSON.stringify(status))
  }

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  const fetchNotifications = async () => {
    loading.value = true
    try {
      const alerts = await dataService.getAlerts()
      const readStatus = getReadStatus()
      
      notifications.value = alerts.map(alert => ({
        ...alert,
        read: !!readStatus[alert.id],
        createdAt: alert.dueDate // Fallback to dueDate as creation relative for mock feel
      })).sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)))
      
      error.value = null
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      error.value = 'Failed to load notifications'
    } finally {
      loading.value = false
    }
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      const readStatus = getReadStatus()
      readStatus[id] = true
      saveReadStatus(readStatus)
    }
  }

  const markAllAsRead = () => {
    const readStatus = getReadStatus()
    notifications.value.forEach(n => {
      n.read = true
      readStatus[n.id] = true
    })
    saveReadStatus(readStatus)
  }

  const clearNotifications = () => {
    notifications.value = []
    localStorage.removeItem('cs_read_notifications')
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }
})
