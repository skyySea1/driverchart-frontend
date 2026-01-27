import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dataService } from '@/services/dataService'
import dayjs from 'dayjs'
import type { DocumentLog } from '@/types'

export const useDocumentsStore = defineStore('documents', () => {
  // State
  const recentUploads = ref<DocumentLog[]>([])
  const lastUpdate = ref<Record<string, number>>({})
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function uploadDocument(payload: {
    entityId: string
    documentType: string
    file: File
    entityName: string
    expiryDate?: string
    isApplicant?: boolean
  }) {
    isUploading.value = true
    error.value = null

    try {
      const uploadDate = dayjs().toISOString()

      const result = await dataService.uploadDocument(
        payload.entityId,
        payload.documentType,
        payload.file,
        uploadDate,
        payload.entityName,
        payload.expiryDate,
        payload.isApplicant ? payload.entityName : undefined,
      )

      // Update local state to reflect change immediately
      const newLog: DocumentLog = {
        id: crypto.randomUUID(), // Temporary ID until refresh
        date: uploadDate,
        type: payload.documentType,
        fileName: payload.file.name,
        user: 'Current User', // TODO: Get from AuthStore if needed
        fileUrl: result.url,
        entityName: payload.entityName,
      }

      recentUploads.value.unshift(newLog)

      // Trigger update timestamp for this entity
      const trackId = payload.entityId
      lastUpdate.value[trackId] = Date.now()

      return result
    } catch (err) {
      console.error('Store upload failed:', err)
      throw err
    } finally {
      isUploading.value = false
    }
  }

  async function uploadPublicDocument(token: string, file: File) {
    isUploading.value = true
    error.value = null
    try {
      const result = await dataService.uploadWithToken(token, file)
      // We don't necessarily update "recentUploads" here because public view might be isolated,
      // but if we wanted to show it in the session (if the user is coincidentally logged in?), we could.
      // For now, just proxying the call keeps logic centralized.
      return result
    } catch (err) {
      console.error('Store public upload failed:', err)
      throw err
    } finally {
      isUploading.value = false
    }
  }

  function notifyExternalUpdate(entityId: string) {
    lastUpdate.value[entityId] = Date.now()
  }

  return {
    recentUploads,
    lastUpdate,
    isUploading,
    error,
    uploadDocument,
    uploadPublicDocument,
    notifyExternalUpdate,
  }
})
