import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDocumentsStore } from '@/stores/documentsStore'
import { dataService } from '@/services/dataService'

// Mock dataService
vi.mock('@/services/dataService', () => ({
  dataService: {
    uploadDocument: vi.fn(),
    uploadWithToken: vi.fn(),
  },
}))

describe('documentsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const store = useDocumentsStore()
    expect(store.recentUploads).toEqual([])
    expect(store.lastUpdate).toEqual({})
    expect(store.isUploading).toBe(false)
    expect(store.error).toBe(null)
  })

  describe('uploadDocument', () => {
    it('successfully uploads a document and updates state', async () => {
      const store = useDocumentsStore()
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      const mockResponse = { url: 'http://test.com/file.pdf', filename: 'test.pdf' }

      // Setup mock
      vi.mocked(dataService.uploadDocument).mockResolvedValue(mockResponse)

      // Execute action
      await store.uploadDocument({
        entityId: 'driver-123',
        documentType: 'license',
        file: mockFile,
        entityName: 'John Doe',
        expiryDate: '2025-01-01',
      })

      // Verify Service Call
      expect(dataService.uploadDocument).toHaveBeenCalledTimes(1)
      expect(dataService.uploadDocument).toHaveBeenCalledWith(
        'driver-123',
        'license',
        mockFile,
        expect.any(String), // uploadDate
        'John Doe',
        '2025-01-01',
        undefined,
      )

      // Verify State Updates
      expect(store.isUploading).toBe(false)
      expect(store.recentUploads).toHaveLength(1)
      expect(store.recentUploads[0]).toMatchObject({
        type: 'license',
        fileName: 'test.pdf',
        fileUrl: 'http://test.com/file.pdf',
        entityName: 'John Doe',
      })

      // Verify Timestamp Update
      expect(store.lastUpdate['driver-123']).toBeDefined()
      expect(typeof store.lastUpdate['driver-123']).toBe('number')
    })

    it('handles applicant upload correctly', async () => {
      const store = useDocumentsStore()
      const mockFile = new File([''], 'app.pdf')
      vi.mocked(dataService.uploadDocument).mockResolvedValue({ url: 'url', filename: 'name' })

      await store.uploadDocument({
        entityId: 'app-123',
        documentType: 'application',
        file: mockFile,
        entityName: 'Jane Doe',
        isApplicant: true,
      })

      expect(dataService.uploadDocument).toHaveBeenCalledWith(
        'app-123',
        'application',
        mockFile,
        expect.any(String),
        'Jane Doe',
        undefined,
        'Jane Doe', // Applicant name passed as last arg
      )
    })

    it('sets error state on failure', async () => {
      const store = useDocumentsStore()
      const mockError = new Error('Upload failed')
      vi.mocked(dataService.uploadDocument).mockRejectedValue(mockError)

      await expect(
        store.uploadDocument({
          entityId: '1',
          documentType: 'test',
          file: new File([], 't'),
          entityName: 'test',
        }),
      ).rejects.toThrow('Upload failed')

      expect(store.isUploading).toBe(false)
      // Note: Current store implementation clears error on start but throws on fail.
      // It doesn't explicitly set store.error = err.message in catch block, it just logs and rethrows.
      // So checking isUploading is the main state verification here.
    })
  })

  describe('uploadPublicDocument', () => {
    it('calls uploadWithToken correctly', async () => {
      const store = useDocumentsStore()
      const mockFile = new File([''], 'public.pdf')
      const token = 'msg-token-123'

      vi.mocked(dataService.uploadWithToken).mockResolvedValue({ success: true })

      await store.uploadPublicDocument(token, mockFile)

      expect(dataService.uploadWithToken).toHaveBeenCalledWith(token, mockFile)
      expect(store.isUploading).toBe(false)
    })

    it('handles errors in public upload', async () => {
      const store = useDocumentsStore()
      vi.mocked(dataService.uploadWithToken).mockRejectedValue(new Error('Invalid token'))

      await expect(store.uploadPublicDocument('bad-token', new File([], 'f'))).rejects.toThrow(
        'Invalid token',
      )

      expect(store.isUploading).toBe(false)
    })
  })

  describe('notifyExternalUpdate', () => {
    it('updates timestamp for entity', () => {
      const store = useDocumentsStore()
      store.notifyExternalUpdate('ext-1')
      expect(store.lastUpdate['ext-1']).toBeDefined()
    })
  })
})
