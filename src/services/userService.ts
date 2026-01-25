// src/services/userService.ts
import { apiClient } from './apiService'
import type { User } from '@/types'

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users')
    return response.data
  },

  createUser: async (user: Partial<User> & { password?: string }): Promise<string> => {
    const response = await apiClient.post<{ id: string }>('/users', user)
    return response.data.id
  },

  updateUser: async (id: string, user: Partial<User> & { password?: string }): Promise<void> => {
    await apiClient.put(`/users/${id}`, user)
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  }
}
