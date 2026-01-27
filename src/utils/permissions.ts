// src/utils/permissions.ts
import type { UserRole } from '@/types'

// 1. Definition of all available permissions in the system
export const PERMISSIONS = {
  // Users
  USERS_MANAGE: 'users:manage', // Create, Edit, Delete users

  // Drivers
  DRIVERS_VIEW: 'drivers:view',
  DRIVERS_CREATE: 'drivers:create',
  DRIVERS_EDIT: 'drivers:edit',
  DRIVERS_DELETE: 'drivers:delete',

  // Documents
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',

  // Vehicles
  VEHICLES_MANAGE: 'vehicles:manage',

  // Reports & Audit
  REPORTS_VIEW: 'reports:view',
  AUDIT_FULL_ACCESS: 'audit:full',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// 2. Mapping Roles to Permissions (The Catalog)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    // Admin has everything
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.DRIVERS_CREATE,
    PERMISSIONS.DRIVERS_EDIT,
    PERMISSIONS.DRIVERS_DELETE,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.VEHICLES_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AUDIT_FULL_ACCESS,
  ],
  Manager: [
    // Manager can do almost everything except managing system users and deleting critical data
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.DRIVERS_CREATE,
    PERMISSIONS.DRIVERS_EDIT,
    // No DRIVERS_DELETE by default for manager (optional, can be added)
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.VEHICLES_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AUDIT_FULL_ACCESS,
  ],
  Dispatcher: [
    // Dispatcher focuses on viewing and basic fleet ops
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.VEHICLES_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
  ],
  Auditor: [
    // Read-only mostly, but deep access to reports
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AUDIT_FULL_ACCESS,
  ],
  Viewer: [
    // Basic read-only
    PERMISSIONS.DRIVERS_VIEW,
  ],
}

// Helper to get permissions for a specific role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}
