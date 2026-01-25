import { computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { getPermissionsForRole, type Permission } from '@/utils/permissions'

export function usePermissions() {
  const authStore = useAuthStore()

  const userPermissions = computed(() => {
    if (!authStore.user) return []
    return getPermissionsForRole(authStore.user.role)
  })

  function can(permission: Permission): boolean {
    if (!authStore.user) return false
    // Admin override (optional, but good for safety)
    if (authStore.user.role === 'Admin') return true

    return userPermissions.value.includes(permission)
  }

  // Check if user has ANY of the provided permissions
  function canAny(permissions: Permission[]): boolean {
    return permissions.some(p => can(p))
  }

  return {
    can,
    canAny,
    userPermissions
  }
}
